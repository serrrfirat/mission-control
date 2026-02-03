'use client';

import { useStore } from '../store';
import type { Agent } from '../types';

export function useAgents(): Agent[] {
  return useStore((s) => s.agents);
}

export function useAgent(id: string): Agent | undefined {
  return useStore((s) => s.agents.find((a) => a.id === id));
}

export function useAgentSessionKey(agentId: string): string {
  const agent = useAgent(agentId);
  if (!agent) return '';
  return `agent:main:cron:${agent.cronJobId}`;
}
