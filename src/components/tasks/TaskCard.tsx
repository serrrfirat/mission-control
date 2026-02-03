'use client';

import Link from 'next/link';
import { Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useMoveTaskStatus, useRemoveTask } from '@/lib/hooks/useTasks';
import { useAgents } from '@/lib/hooks/useAgents';
import { TaskStatusBadge } from './TaskStatusBadge';
import { formatRelativeTime } from '@/lib/utils';
import type { TaskStatus } from '@/lib/types';
import type { Id } from '../../../convex/_generated/dataModel';

interface TaskCardProps {
  task: {
    _id: Id<'tasks'>;
    title: string;
    description?: string;
    assigneeIds: string[];
    status: TaskStatus;
    priority: string;
    updatedAt: number;
  };
}

const nextStatus: Record<TaskStatus, TaskStatus | null> = {
  inbox: 'assigned',
  assigned: 'in_progress',
  in_progress: 'review',
  review: 'done',
  done: null,
};

const prevStatus: Record<TaskStatus, TaskStatus | null> = {
  inbox: null,
  assigned: 'inbox',
  in_progress: 'assigned',
  review: 'in_progress',
  done: 'review',
};

const priorityColors: Record<string, string> = {
  low: 'text-muted',
  medium: 'text-muted-foreground',
  high: 'text-warning',
  urgent: 'text-error',
};

export function TaskCard({ task }: TaskCardProps) {
  const moveStatus = useMoveTaskStatus();
  const removeTask = useRemoveTask();
  const agents = useAgents();

  const next = nextStatus[task.status];
  const prev = prevStatus[task.status];

  const assignedAgents = agents.filter((a) => task.assigneeIds.includes(a.id));

  return (
    <div className="glass rounded-2xl p-3.5 space-y-2 animate-slide-in card-hover">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/tasks/${task._id}`} className="flex-1 min-w-0">
          <h4 className="text-sm font-medium leading-tight hover:text-accent-light transition-colors">
            {task.title}
          </h4>
        </Link>
        <button
          onClick={() => removeTask({ taskId: task._id })}
          className="text-muted hover:text-error press-scale shrink-0 transition-colors duration-300"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-muted font-light line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <TaskStatusBadge status={task.status} />
        {task.priority !== 'medium' && (
          <span className={`text-[10px] font-semibold uppercase ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {assignedAgents.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-accent-light truncate">
              {assignedAgents.map((a) => a.emoji).join('')}{' '}
              {assignedAgents.map((a) => a.name).join(', ')}
            </span>
          )}
          <span className="text-[10px] font-mono text-muted shrink-0">
            {formatRelativeTime(task.updatedAt)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {prev && (
            <button
              onClick={() => moveStatus({ taskId: task._id, status: prev })}
              className="w-7 h-7 flex items-center justify-center rounded-lg glass text-muted hover:text-foreground press-scale"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {next && (
            <button
              onClick={() => moveStatus({ taskId: task._id, status: next })}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-accent/20 border border-accent/30 text-accent-light press-scale"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
