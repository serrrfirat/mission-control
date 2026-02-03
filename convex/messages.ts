import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const listByTask = query({
  args: { taskId: v.id('tasks') },
  handler: async (ctx, { taskId }) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_taskId', (q) => q.eq('taskId', taskId))
      .collect();
  },
});

export const create = mutation({
  args: {
    taskId: v.id('tasks'),
    fromAgentId: v.string(),
    content: v.string(),
    mentions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error('Task not found');

    const mentions = args.mentions ?? [];
    // Auto-detect @mentions in content
    const mentionRegex = /@(\w+)/g;
    let match;
    while ((match = mentionRegex.exec(args.content)) !== null) {
      const name = match[1].toLowerCase();
      if (!mentions.includes(name)) {
        mentions.push(name);
      }
    }

    const now = Date.now();
    const messageId = await ctx.db.insert('messages', {
      taskId: args.taskId,
      fromAgentId: args.fromAgentId,
      content: args.content,
      mentions,
      createdAt: now,
    });

    // Create activity
    await ctx.db.insert('activities', {
      type: 'comment_added',
      agentId: args.fromAgentId,
      taskId: args.taskId,
      message: `Comment on "${task.title}": ${args.content.slice(0, 100)}`,
      createdAt: now,
    });

    // Create notifications for mentioned agents
    for (const mentionedId of mentions) {
      if (mentionedId !== args.fromAgentId) {
        await ctx.db.insert('notifications', {
          mentionedAgentId: mentionedId,
          fromAgentId: args.fromAgentId,
          taskId: args.taskId,
          messageId,
          content: args.content,
          delivered: false,
          createdAt: now,
        });
      }
    }

    return messageId;
  },
});
