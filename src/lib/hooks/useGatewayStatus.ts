'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store';
import { AGENT_ROSTER, findAgentByCronJobId, identifyAgent } from '../agents';
import { extractSummary, generateId } from '../utils';
import type { Agent, AgentStatus, FeedItem, GatewayStatus } from '../types';

export function useGatewayStatus(intervalMs = 10000) {
  const { setGatewayOnline, setAgents, addFeedItem, agents } = useStore();
  const seenKeys = useRef(new Set<string>());
  const agentsRef = useRef(agents);
  agentsRef.current = agents;

  const poll = useCallback(async () => {
    try {
      const res = await fetch('/api/gateway/status');
      if (!res.ok) {
        setGatewayOnline(false);
        return;
      }

      const data: GatewayStatus & { online: boolean } = await res.json();
      setGatewayOnline(data.online);

      if (!data.online) return;

      // Determine agent statuses from recent sessions
      const updatedAgents: Agent[] = AGENT_ROSTER.map((agent) => {
        const recentSession = data.sessions?.recent?.find((s) => {
          const match = s.key?.match(/agent:\w+:cron:(.+)/);
          return match && match[1] === agent.cronJobId;
        });

        let status: AgentStatus = 'idle';
        let lastActivity = agent.lastActivity;
        let lastActivityTime = agent.lastActivityTime;

        if (recentSession) {
          if (recentSession.age !== undefined && recentSession.age < 120) {
            status = 'working';
          }
          lastActivityTime = recentSession.updatedAt;
        }

        return { ...agent, status, lastActivity, lastActivityTime };
      });

      setAgents(updatedAgents);

      // Parse queued system events into feed
      for (const eventStr of data.queuedSystemEvents || []) {
        if (typeof eventStr !== 'string') continue;
        let text = eventStr;
        if (text.startsWith('Cron: ')) text = text.slice(6);
        if (text.trim() === 'HEARTBEAT_OK') continue;

        const source = identifyAgent(text);
        const summary = extractSummary(text);
        const key = `event:${source}:${summary}`;
        if (seenKeys.current.has(key)) continue;
        seenKeys.current.add(key);

        const item: FeedItem = {
          id: generateId(),
          timestamp: Date.now(),
          source,
          summary,
          type: 'cron',
        };
        addFeedItem(item);
      }

      // Parse recent sessions into feed
      for (const session of data.sessions?.recent || []) {
        const match = session.key?.match(/agent:\w+:cron:(.+)/);
        if (!match) continue;

        const agent = findAgentByCronJobId(match[1]);
        const name = agent?.name || '[agent]';
        const ts = session.updatedAt && session.updatedAt > 1e12
          ? session.updatedAt
          : (session.updatedAt || 0) * 1000;

        const ageMin = Math.floor((session.age || 0) / 60);
        const ageStr = ageMin < 60 ? `${ageMin}m ago` : `${Math.floor(ageMin / 60)}h ago`;
        const summary = `Session active (${ageStr}, ${session.totalTokens || 0} tokens, ${session.model || 'unknown'})`;

        const key = `session:${match[1]}:${session.updatedAt}`;
        if (seenKeys.current.has(key)) continue;
        seenKeys.current.add(key);

        addFeedItem({
          id: generateId(),
          timestamp: ts,
          source: name,
          summary,
          type: 'session',
        });
      }

      // Trim seen keys
      if (seenKeys.current.size > 200) {
        const arr = Array.from(seenKeys.current);
        seenKeys.current = new Set(arr.slice(-100));
      }
    } catch {
      setGatewayOnline(false);
    }
  }, [setGatewayOnline, setAgents, addFeedItem]);

  useEffect(() => {
    poll();
    const id = setInterval(poll, intervalMs);
    return () => clearInterval(id);
  }, [poll, intervalMs]);
}
