'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useCreateTask } from '@/lib/hooks/useTasks';
import { AssigneePicker } from './AssigneePicker';
import type { TaskPriority } from '@/lib/types';

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export function TaskForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const createTask = useCreateTask();

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await createTask({
      title: title.trim(),
      description: description.trim() || undefined,
      assigneeIds: assigneeIds.length > 0 ? assigneeIds : undefined,
      priority,
    });
    setTitle('');
    setDescription('');
    setAssigneeIds([]);
    setPriority('medium');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-border text-sm text-muted press-scale hover:text-accent-light hover:border-accent/30 transition-all duration-300"
      >
        <Plus className="w-4 h-4" />
        Add Task
      </button>
    );
  }

  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="label-upper text-accent-light">New Task</h4>
        <button onClick={() => setOpen(false)} className="text-muted press-scale">
          <X className="w-4 h-4" />
        </button>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full bg-surface rounded-xl px-4 py-2.5 text-sm font-light outline-none border border-border-subtle focus:border-accent/40 placeholder:text-muted transition-colors duration-300"
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full bg-surface rounded-xl px-4 py-2.5 text-xs font-light outline-none border border-border-subtle focus:border-accent/40 placeholder:text-muted resize-none transition-colors duration-300"
      />
      <AssigneePicker selectedIds={assigneeIds} onChange={setAssigneeIds} />
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted uppercase tracking-wider">Priority</span>
        <div className="flex gap-1.5">
          {PRIORITIES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPriority(value)}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all duration-200 ${
                priority === value
                  ? 'border-accent/40 bg-accent/15 text-accent-light'
                  : 'border-border-subtle text-muted hover:text-muted-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!title.trim()}
        className="w-full py-2.5 rounded-full bg-accent/20 border border-accent/30 text-accent-light text-sm font-semibold press-scale disabled:opacity-30"
      >
        Create Task
      </button>
    </div>
  );
}
