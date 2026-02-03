'use client';

import { useRef } from 'react';
import { useStore } from '@/lib/store';
import { useActivities } from '@/lib/hooks/useActivities';
import { FeedItemCard } from './FeedItem';
import { EmptyState } from '@/components/shared/EmptyState';
import { Radio } from 'lucide-react';
import type { FeedItem } from '@/lib/types';

export function LiveFeed() {
  const gatewayFeedItems = useStore((s) => s.feedItems);
  const convexActivities = useActivities(100);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Convert Convex activities to FeedItem format and merge with gateway events
  const activityFeedItems: FeedItem[] = convexActivities.map((a) => ({
    id: `activity:${a._id}`,
    timestamp: a.createdAt,
    source: '[activity]',
    summary: a.message,
    type: 'activity' as const,
    taskId: a.taskId,
  }));

  const merged = [...gatewayFeedItems, ...activityFeedItems];
  const sorted = merged.sort((a, b) => b.timestamp - a.timestamp);

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={Radio}
        title="No events yet"
        description="Events from agent sessions, cron jobs, and task activity will appear here"
      />
    );
  }

  return (
    <div className="flex flex-col">
      {sorted.map((item) => (
        <FeedItemCard key={item.id} item={item} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
