'use client';

import Link from 'next/link';
import { useAgents } from '@/lib/hooks/useAgents';
import { AgentAvatar } from '@/components/agents/AgentAvatar';
import { ChevronRight } from 'lucide-react';

export default function ChatListPage() {
  const agents = useAgents();

  return (
    <div>
      <div className="px-5 pt-5 pb-2">
        <h2 className="text-xl font-bold italic font-[family-name:var(--font-display)] text-accent-light">Chat</h2>
        <p className="text-xs text-muted font-light mt-1">Select an agent to start chatting</p>
      </div>
      <div className="divide-y divide-border-subtle">
        {agents.map((agent) => (
          <Link
            key={agent.id}
            href={`/chat/${agent.id}`}
            className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-surface-hover press-scale transition-colors duration-300"
          >
            <AgentAvatar emoji={agent.emoji} status={agent.status} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{agent.name}</span>
                <span className="label-upper text-muted">{agent.role}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
