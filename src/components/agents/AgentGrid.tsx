'use client';

import { useAgents } from '@/lib/hooks/useAgents';
import { AgentCard } from './AgentCard';

export function AgentGrid() {
  const agents = useAgents();

  return (
    <div className="grid grid-cols-2 gap-3 px-4 pb-4">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
