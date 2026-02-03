'use client';

import { use } from 'react';
import { TaskDetail } from '@/components/tasks/TaskDetail';
import { useTaskDetail } from '@/lib/hooks/useTaskDetail';
import { EmptyState } from '@/components/shared/EmptyState';
import { AlertCircle } from 'lucide-react';
import type { Id } from '../../../../../convex/_generated/dataModel';

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = use(params);
  const { task, messages } = useTaskDetail(taskId as Id<'tasks'>);

  if (task === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (task === null) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Task not found"
        description="This task may have been deleted"
      />
    );
  }

  return <TaskDetail task={task} messages={messages} />;
}
