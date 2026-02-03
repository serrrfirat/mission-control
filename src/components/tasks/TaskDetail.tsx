'use client';

import { useState } from 'react';
import { ArrowLeft, Edit3, Check } from 'lucide-react';
import Link from 'next/link';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskComments } from './TaskComments';
import { AssigneePicker } from './AssigneePicker';
import { useMoveTaskStatus, useAssignTask, useUpdateTask } from '@/lib/hooks/useTasks';
import { useAgents } from '@/lib/hooks/useAgents';
import { formatRelativeTime } from '@/lib/utils';
import type { TaskStatus } from '@/lib/types';
import type { Id } from '../../../convex/_generated/dataModel';

const STATUS_FLOW: TaskStatus[] = ['inbox', 'assigned', 'in_progress', 'review', 'done'];

interface TaskDetailProps {
  task: {
    _id: Id<'tasks'>;
    title: string;
    description?: string;
    assigneeIds: string[];
    status: TaskStatus;
    priority: string;
    createdBy?: string;
    createdAt: number;
    updatedAt: number;
  };
  messages: Array<{
    _id: string;
    fromAgentId: string;
    content: string;
    createdAt: number;
  }>;
}

export function TaskDetail({ task, messages }: TaskDetailProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description ?? '');
  const moveStatus = useMoveTaskStatus();
  const assignTask = useAssignTask();
  const updateTask = useUpdateTask();
  const agents = useAgents();

  const assignedAgents = agents.filter((a) => task.assigneeIds.includes(a.id));

  const handleSave = async () => {
    await updateTask({
      taskId: task._id,
      title: editTitle.trim(),
      description: editDesc.trim() || undefined,
    });
    setEditing(false);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Back + Status */}
      <div className="flex items-center justify-between">
        <Link href="/tasks" className="flex items-center gap-1.5 text-muted hover:text-foreground press-scale">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs">Tasks</span>
        </Link>
        <TaskStatusBadge status={task.status} size="md" />
      </div>

      {/* Title + Description */}
      <div className="glass rounded-2xl p-4 space-y-3">
        {editing ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-surface rounded-xl px-3 py-2 text-sm font-medium outline-none border border-border-subtle focus:border-accent/40"
              autoFocus
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={3}
              className="w-full bg-surface rounded-xl px-3 py-2 text-xs font-light outline-none border border-border-subtle focus:border-accent/40 resize-none"
            />
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs text-accent-light press-scale"
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-base font-semibold leading-tight">{task.title}</h2>
              <button
                onClick={() => setEditing(true)}
                className="text-muted hover:text-foreground press-scale shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            {task.description && (
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                {task.description}
              </p>
            )}
          </>
        )}

        <div className="flex items-center gap-3 text-[10px] text-muted">
          <span>Created {formatRelativeTime(task.createdAt)}</span>
          <span>Updated {formatRelativeTime(task.updatedAt)}</span>
          {task.priority !== 'medium' && (
            <span className={task.priority === 'urgent' ? 'text-error' : task.priority === 'high' ? 'text-warning' : ''}>
              {task.priority.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Status Flow */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <h4 className="label-upper text-muted-foreground">Status</h4>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FLOW.map((s) => (
            <button
              key={s}
              onClick={() => moveStatus({ taskId: task._id, status: s })}
              className={`text-[10px] px-3 py-1.5 rounded-full border transition-all duration-200 ${
                task.status === s
                  ? 'border-accent/40 bg-accent/15 text-accent-light'
                  : 'border-border-subtle text-muted hover:text-muted-foreground press-scale'
              }`}
            >
              {s.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Assignees */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <h4 className="label-upper text-muted-foreground">Assignees</h4>
        {assignedAgents.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {assignedAgents.map((a) => (
              <span key={a.id} className="flex items-center gap-1.5 text-xs text-accent-light">
                <span className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-xs border border-border-subtle">
                  {a.emoji}
                </span>
                {a.name}
              </span>
            ))}
          </div>
        )}
        <AssigneePicker
          selectedIds={task.assigneeIds}
          onChange={(ids) => assignTask({ taskId: task._id, assigneeIds: ids })}
        />
      </div>

      {/* Comments */}
      <div className="glass rounded-2xl p-4">
        <TaskComments taskId={task._id} messages={messages} />
      </div>
    </div>
  );
}
