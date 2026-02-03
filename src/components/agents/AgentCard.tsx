'use client';

import Link from 'next/link';
import { AgentAvatar } from './AgentAvatar';
import type { Agent } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

interface AgentCardProps {
  agent: Agent;
}

const statusColors = {
  idle: 'text-muted',
  working: 'text-accent-light',
  offline: 'text-error',
};

const statusLabels = {
  idle: 'Idle',
  working: 'Active',
  offline: 'Offline',
};

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link
      href={`/chat/${agent.id}`}
      className="glass rounded-3xl p-3.5 press-scale card-hover block"
    >
      <div className="flex items-start gap-3">
        <AgentAvatar emoji={agent.emoji} status={agent.status} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold truncate">{agent.name}</h3>
            <span className={`label-upper ${statusColors[agent.status]}`}>
              {statusLabels[agent.status]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">{agent.role}</p>
          {agent.lastActivityTime && (
            <p className="text-[10px] text-muted font-mono mt-1.5">
              {formatRelativeTime(agent.lastActivityTime)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
