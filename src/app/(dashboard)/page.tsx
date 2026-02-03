'use client';

import { AgentGrid } from '@/components/agents/AgentGrid';
import { useStore } from '@/lib/store';

export default function SquadOverviewPage() {
  const agents = useStore((s) => s.agents);
  const working = agents.filter((a) => a.status === 'working').length;
  const idle = agents.filter((a) => a.status === 'idle').length;

  return (
    <div>
      <div className="px-5 pt-5 pb-2 flex items-center gap-4">
        <h2 className="text-xl font-bold italic font-[family-name:var(--font-display)] text-accent-light">Squad</h2>
        <div className="flex gap-3 label-upper text-muted">
          <span>
            <span className="text-accent-light">{working}</span> active
          </span>
          <span>
            <span className="text-muted-foreground">{idle}</span> idle
          </span>
        </div>
      </div>
      <AgentGrid />
    </div>
  );
}
