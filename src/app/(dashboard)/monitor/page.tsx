'use client';

import { LiveFeed } from '@/components/monitor/LiveFeed';
import { useStore } from '@/lib/store';
import { useActivities } from '@/lib/hooks/useActivities';

export default function MonitorPage() {
  const feedItems = useStore((s) => s.feedItems);
  const activities = useActivities(100);
  const totalCount = feedItems.length + activities.length;

  return (
    <div>
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold italic font-[family-name:var(--font-display)] text-accent-light">Live Monitor</h2>
        <span className="label-upper text-muted">{totalCount} events</span>
      </div>
      <LiveFeed />
    </div>
  );
}
