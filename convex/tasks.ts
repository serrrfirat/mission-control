import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

const taskStatusValidator = v.union(
  v.literal('inbox'),
  v.literal('assigned'),
  v.literal('in_progress'),
  v.literal('review'),
  v.literal('done')
);

const priorityValidator = v.union(
  v.literal('low'),
  v.literal('medium'),
  v.literal('high'),
  v.literal('urgent')
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tasks').order('desc').collect();
  },
});

export const get = query({
  args: { taskId: v.id('tasks') },
  handler: async (ctx, { taskId }) => {
    return await ctx.db.get(taskId);
  },
});

export const getByStatus = query({
  args: { status: taskStatusValidator },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query('tasks')
      .withIndex('by_status', (q) => q.eq('status', status))
      .collect();
  },
});

export const getForAgent = query({
  args: { agentId: v.string() },
  handler: async (ctx, { agentId }) => {
    const allTasks = await ctx.db.query('tasks').collect();
    return allTasks.filter((t) => t.assigneeIds.includes(agentId));
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    assigneeIds: v.optional(v.array(v.string())),
    createdBy: v.optional(v.string()),
    priority: v.optional(priorityValidator),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const assigneeIds = args.assigneeIds ?? [];
    const status = assigneeIds.length > 0 ? 'assigned' : 'inbox';

    const taskId = await ctx.db.insert('tasks', {
      title: args.title,
      description: args.description,
      status,
      assigneeIds,
      createdBy: args.createdBy,
      priority: args.priority ?? 'medium',
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert('activities', {
      type: 'task_created',
      agentId: args.createdBy,
      taskId,
      message: `Task "${args.title}" created`,
      createdAt: now,
    });

    return taskId;
  },
});

export const update = mutation({
  args: {
    taskId: v.id('tasks'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(priorityValidator),
  },
  handler: async (ctx, { taskId, ...updates }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error('Task not found');

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.priority !== undefined) patch.priority = updates.priority;

    await ctx.db.patch(taskId, patch);
  },
});

export const assign = mutation({
  args: {
    taskId: v.id('tasks'),
    assigneeIds: v.array(v.string()),
  },
  handler: async (ctx, { taskId, assigneeIds }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error('Task not found');

    const now = Date.now();
    const newStatus = assigneeIds.length > 0 && task.status === 'inbox' ? 'assigned' : task.status;

    await ctx.db.patch(taskId, {
      assigneeIds,
      status: newStatus,
      updatedAt: now,
    });

    await ctx.db.insert('activities', {
      type: 'task_assigned',
      taskId,
      message: `Task "${task.title}" assigned to ${assigneeIds.join(', ')}`,
      createdAt: now,
    });
  },
});

export const moveStatus = mutation({
  args: {
    taskId: v.id('tasks'),
    status: taskStatusValidator,
  },
  handler: async (ctx, { taskId, status }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error('Task not found');

    const now = Date.now();
    await ctx.db.patch(taskId, { status, updatedAt: now });

    await ctx.db.insert('activities', {
      type: 'task_status_changed',
      taskId,
      message: `Task "${task.title}" moved to ${status}`,
      createdAt: now,
    });
  },
});

export const remove = mutation({
  args: { taskId: v.id('tasks') },
  handler: async (ctx, { taskId }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error('Task not found');

    // Delete related messages
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_taskId', (q) => q.eq('taskId', taskId))
      .collect();
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    // Delete related documents
    const docs = await ctx.db
      .query('documents')
      .withIndex('by_taskId', (q) => q.eq('taskId', taskId))
      .collect();
    for (const doc of docs) {
      await ctx.db.delete(doc._id);
    }

    await ctx.db.delete(taskId);

    await ctx.db.insert('activities', {
      type: 'task_deleted',
      message: `Task "${task.title}" deleted`,
      createdAt: Date.now(),
    });
  },
});
