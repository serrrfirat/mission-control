'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

export function useTaskDetail(taskId: Id<'tasks'>) {
  const task = useQuery(api.tasks.get, { taskId });
  const messages = useQuery(api.messages.listByTask, { taskId }) ?? [];
  const activities = useQuery(api.activities.listByTask, { taskId }) ?? [];

  return { task, messages, activities };
}

export function useTaskDocuments(taskId: Id<'tasks'>) {
  const allDocs = useQuery(api.documents.list) ?? [];
  return allDocs.filter((d) => d.taskId === taskId);
}

export function useCreateMessage() {
  return useMutation(api.messages.create);
}

export function useCreateDocument() {
  return useMutation(api.documents.create);
}
