import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('agents').collect();
  },
});

export const get = query({
  args: { agentId: v.string() },
  handler: async (ctx, { agentId }) => {
    return await ctx.db
      .query('agents')
      .withIndex('by_agentId', (q) => q.eq('agentId', agentId))
      .unique();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('agents').collect();
    if (existing.length > 0) return { seeded: false, count: existing.length };

    const roster = [
      { agentId: 'jarvis', name: 'Jarvis', role: 'Squad Lead', emoji: '🎯', cronJobId: 'f2d55be7-3932-46a3-b830-810b7f375af0' },
      { agentId: 'shuri', name: 'Shuri', role: 'Product Analyst', emoji: '📊', cronJobId: '012618a6-6196-4493-9a1f-80eaf0573652' },
      { agentId: 'friday', name: 'Friday', role: 'Developer', emoji: '⚙️', cronJobId: 'd0291808-9ddb-4277-8a98-339651bf62ec' },
      { agentId: 'loki', name: 'Loki', role: 'Content Writer', emoji: '✍️', cronJobId: 'af7c0b7c-0d62-48c1-9ba0-09943e537540' },
      { agentId: 'wanda', name: 'Wanda', role: 'Designer', emoji: '🎨', cronJobId: '8c1eadf6-cecf-4fea-8772-d8504e9f1d35' },
      { agentId: 'vision', name: 'Vision', role: 'SEO Analyst', emoji: '🔍', cronJobId: 'a010dd8f-1348-4409-95b4-954f29c6578c' },
      { agentId: 'fury', name: 'Fury', role: 'Researcher', emoji: '🕵️', cronJobId: '0be0e054-27be-4f17-a10f-8fff8e51f88b' },
      { agentId: 'quill', name: 'Quill', role: 'Social Media', emoji: '📢', cronJobId: '669cc5f5-ce1b-4329-a50f-a30fca9b9319' },
      { agentId: 'pepper', name: 'Pepper', role: 'Email Marketing', emoji: '📧', cronJobId: 'e6d44c0e-862b-4572-a6a3-69fbf4ae3ed3' },
      { agentId: 'wong', name: 'Wong', role: 'Documentation', emoji: '📚', cronJobId: 'b5ac7691-b7b6-4c94-a016-55aadbd610a4' },
    ];

    for (const agent of roster) {
      await ctx.db.insert('agents', {
        ...agent,
        status: 'idle',
        lastSeenAt: Date.now(),
      });
    }

    return { seeded: true, count: roster.length };
  },
});

export const updateStatus = mutation({
  args: {
    agentId: v.string(),
    status: v.union(v.literal('idle'), v.literal('working'), v.literal('offline')),
    currentTaskId: v.optional(v.id('tasks')),
  },
  handler: async (ctx, { agentId, status, currentTaskId }) => {
    const agent = await ctx.db
      .query('agents')
      .withIndex('by_agentId', (q) => q.eq('agentId', agentId))
      .unique();
    if (!agent) throw new Error(`Agent not found: ${agentId}`);

    await ctx.db.patch(agent._id, {
      status,
      currentTaskId,
      lastSeenAt: Date.now(),
    });
  },
});
