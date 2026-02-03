import type { TaskStatus } from '@/lib/types';

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  inbox: { label: 'Inbox', color: 'text-muted-foreground', bg: 'bg-muted/20' },
  assigned: { label: 'Assigned', color: 'text-accent-light', bg: 'bg-accent/15' },
  in_progress: { label: 'In Progress', color: 'text-warning', bg: 'bg-warning/15' },
  review: { label: 'Review', color: 'text-purple-400', bg: 'bg-purple-400/15' },
  done: { label: 'Done', color: 'text-success', bg: 'bg-success/15' },
};

interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export function TaskStatusBadge({ status, size = 'sm' }: TaskStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wider ${config.color} ${config.bg} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}
