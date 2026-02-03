import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

const docTypeValidator = v.union(
  v.literal('note'),
  v.literal('spec'),
  v.literal('report'),
  v.literal('artifact')
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('documents').order('desc').collect();
  },
});

export const get = query({
  args: { documentId: v.id('documents') },
  handler: async (ctx, { documentId }) => {
    return await ctx.db.get(documentId);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    type: docTypeValidator,
    taskId: v.optional(v.id('tasks')),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const docId = await ctx.db.insert('documents', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert('activities', {
      type: 'document_created',
      agentId: args.createdBy,
      taskId: args.taskId,
      message: `Document "${args.title}" created`,
      createdAt: now,
    });

    return docId;
  },
});

export const update = mutation({
  args: {
    documentId: v.id('documents'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(docTypeValidator),
  },
  handler: async (ctx, { documentId, ...updates }) => {
    const doc = await ctx.db.get(documentId);
    if (!doc) throw new Error('Document not found');

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.content !== undefined) patch.content = updates.content;
    if (updates.type !== undefined) patch.type = updates.type;

    await ctx.db.patch(documentId, patch);
  },
});

export const remove = mutation({
  args: { documentId: v.id('documents') },
  handler: async (ctx, { documentId }) => {
    const doc = await ctx.db.get(documentId);
    if (!doc) throw new Error('Document not found');
    await ctx.db.delete(documentId);
  },
});
