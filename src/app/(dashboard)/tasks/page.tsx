'use client';

import { TaskBoard } from '@/components/tasks/TaskBoard';
import { useTasks } from '@/lib/hooks/useTasks';

export default function TasksPage() {
  const tasks = useTasks();

  return (
    <div>
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold italic font-[family-name:var(--font-display)] text-accent-light">Tasks</h2>
        <span className="label-upper text-muted">{tasks.length} total</span>
      </div>
      <TaskBoard />
    </div>
  );
}
