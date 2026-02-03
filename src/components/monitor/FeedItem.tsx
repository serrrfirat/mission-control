import Link from 'next/link';
import { formatTime } from '@/lib/utils';
import type { FeedItem as FeedItemType } from '@/lib/types';

interface FeedItemProps {
  item: FeedItemType;
}

const sourceColors: Record<string, string> = {
  '[cron]': 'text-muted',
  '[telegram]': 'text-accent-light',
  '[tg]': 'text-accent-light',
  '[gateway]': 'text-warning',
  '[heartbeat]': 'text-muted',
  '[error]': 'text-error',
  '[task]': 'text-purple-400',
  '[activity]': 'text-accent-light',
};

function getSourceColor(source: string): string {
  if (source.startsWith('[tg]')) return sourceColors['[tg]'];
  return sourceColors[source] || 'text-accent';
}

export function FeedItemCard({ item }: FeedItemProps) {
  const isTaskActivity = item.type === 'activity' && item.id.startsWith('activity:');
  const taskId = isTaskActivity ? (item as FeedItemType & { taskId?: string }).taskId : undefined;

  const content = (
    <div className="animate-slide-in px-5 py-3 border-b border-border-subtle hover:bg-surface-hover transition-colors duration-300">
      <div className="flex items-baseline gap-2.5 mb-1">
        <span className="text-[10px] font-mono text-muted shrink-0">
          {formatTime(item.timestamp)}
        </span>
        <span className={`text-xs font-semibold ${getSourceColor(item.source)}`}>
          {item.source}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed font-light line-clamp-2">
        {item.summary}
      </p>
    </div>
  );

  if (taskId) {
    return <Link href={`/tasks/${taskId}`}>{content}</Link>;
  }

  return content;
}
