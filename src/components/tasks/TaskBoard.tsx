'use client';

import { useTasks } from '@/lib/hooks/useTasks';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import type { TaskStatus } from '@/lib/types';

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'inbox', label: 'Inbox', color: 'text-muted-foreground' },
  { status: 'assigned', label: 'Assigned', color: 'text-accent-light' },
  { status: 'in_progress', label: 'In Progress', color: 'text-warning' },
  { status: 'review', label: 'Review', color: 'text-purple-400' },
  { status: 'done', label: 'Done', color: 'text-success' },
];

export function TaskBoard() {
  const tasks = useTasks();

  return (
    <div className="space-y-6 p-4">
      <TaskForm />

      {COLUMNS.map(({ status, label, color }) => {
        const filtered = tasks.filter((t) => t.status === status);
        return (
          <div key={status}>
            <div className="flex items-center gap-2.5 mb-2.5 px-1">
              <h3 className={`label-upper ${color}`}>
                {label}
              </h3>
              <span className="label-upper text-muted">
                {filtered.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {filtered.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
