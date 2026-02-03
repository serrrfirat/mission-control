import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getUndelivered = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('notifications')
      .withIndex('by_delivered', (q) => q.eq('delivered', false))
      .collect();
  },
});

export const getForAgent = query({
  args: { agentId: v.string() },
  handler: async (ctx, { agentId }) => {
    return await ctx.db
      .query('notifications')
      .withIndex('by_mentionedAgentId', (q) => q.eq('mentionedAgentId', agentId))
      .collect();
  },
});

export const markDelivered = mutation({
  args: { notificationId: v.id('notifications') },
  handler: async (ctx, { notificationId }) => {
    const notif = await ctx.db.get(notificationId);
    if (!notif) throw new Error('Notification not found');
    await ctx.db.patch(notificationId, { delivered: true });
  },
});

export const create = mutation({
  args: {
    mentionedAgentId: v.string(),
    fromAgentId: v.string(),
    taskId: v.id('tasks'),
    messageId: v.id('messages'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('notifications', {
      ...args,
      delivered: false,
      createdAt: Date.now(),
    });
  },
});
