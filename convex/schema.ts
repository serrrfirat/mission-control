import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  agents: defineTable({
    agentId: v.string(),
    name: v.string(),
    role: v.string(),
    emoji: v.string(),
    status: v.union(v.literal('idle'), v.literal('working'), v.literal('offline')),
    currentTaskId: v.optional(v.id('tasks')),
    cronJobId: v.string(),
    sessionKey: v.optional(v.string()),
    lastSeenAt: v.optional(v.number()),
  }).index('by_agentId', ['agentId']),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal('inbox'),
      v.literal('assigned'),
      v.literal('in_progress'),
      v.literal('review'),
      v.literal('done')
    ),
    assigneeIds: v.array(v.string()),
    createdBy: v.optional(v.string()),
    priority: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('urgent')
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_createdAt', ['createdAt']),

  messages: defineTable({
    taskId: v.id('tasks'),
    fromAgentId: v.string(),
    content: v.string(),
    mentions: v.array(v.string()),
    createdAt: v.number(),
  }).index('by_taskId', ['taskId']),

  activities: defineTable({
    type: v.string(),
    agentId: v.optional(v.string()),
    taskId: v.optional(v.id('tasks')),
    message: v.string(),
    createdAt: v.number(),
  }).index('by_createdAt', ['createdAt']),

  documents: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.union(
      v.literal('note'),
      v.literal('spec'),
      v.literal('report'),
      v.literal('artifact')
    ),
    taskId: v.optional(v.id('tasks')),
    createdBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_taskId', ['taskId']),

  notifications: defineTable({
    mentionedAgentId: v.string(),
    fromAgentId: v.string(),
    taskId: v.id('tasks'),
    messageId: v.id('messages'),
    content: v.string(),
    delivered: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_mentionedAgentId', ['mentionedAgentId'])
    .index('by_delivered', ['delivered']),
});
