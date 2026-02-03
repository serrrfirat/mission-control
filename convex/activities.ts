import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const activities = await ctx.db
      .query('activities')
      .withIndex('by_createdAt')
      .order('desc')
      .take(limit ?? 100);
    return activities;
  },
});

export const listByTask = query({
  args: { taskId: v.id('tasks') },
  handler: async (ctx, { taskId }) => {
    const all = await ctx.db.query('activities').order('desc').collect();
    return all.filter((a) => a.taskId === taskId);
  },
});

export const create = mutation({
  args: {
    type: v.string(),
    agentId: v.optional(v.string()),
    taskId: v.optional(v.id('tasks')),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('activities', {
      ...args,
      createdAt: Date.now(),
    });
  },
});
