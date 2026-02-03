'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { TaskStatus, TaskPriority } from '../types';
import type { Id } from '../../../convex/_generated/dataModel';

export function useTasks() {
  const tasks = useQuery(api.tasks.list) ?? [];
  return tasks;
}

export function useTasksByStatus(status: TaskStatus) {
  const tasks = useQuery(api.tasks.getByStatus, { status }) ?? [];
  return tasks;
}

export function useTasksForAgent(agentId: string) {
  const tasks = useQuery(api.tasks.getForAgent, { agentId }) ?? [];
  return tasks;
}

export function useCreateTask() {
  return useMutation(api.tasks.create);
}

export function useUpdateTask() {
  return useMutation(api.tasks.update);
}

export function useAssignTask() {
  return useMutation(api.tasks.assign);
}

export function useMoveTaskStatus() {
  return useMutation(api.tasks.moveStatus);
}

export function useRemoveTask() {
  return useMutation(api.tasks.remove);
}

export type ConvexTaskId = Id<'tasks'>;
export type { TaskStatus, TaskPriority };
