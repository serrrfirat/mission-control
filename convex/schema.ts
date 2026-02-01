import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Agents: The AI team members
  agents: defineTable({
    name: v.string(),
    role: v.string(),
    avatarEmoji: v.optional(v.string()),
    status: v.optional(v.string()), // "idle" | "active" | "blocked"
    currentTaskId: v.optional(v.id("tasks")),
    sessionKey: v.string(),
    isMaster: v.optional(v.boolean()),
    soulFile: v.optional(v.string()), // Path to SOUL.md
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }),

  // Tasks: Work items with full lifecycle
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "inbox" | "assigned" | "in_progress" | "review" | "done" | "blocked"
    priority: v.optional(v.string()), // "low" | "normal" | "high" | "urgent"
    assigneeIds: v.optional(v.array(v.id("agents"))),
    creatorId: v.optional(v.id("agents")),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }),

  // Messages: Comments on tasks
  messages: defineTable({
    taskId: v.id("tasks"),
    agentId: v.id("agents"),
    content: v.string(),
    attachments: v.optional(v.array(v.id("documents"))),
    createdAt: v.optional(v.number()),
  }),

  // Activities: Real-time event stream
  activities: defineTable({
    type: v.string(), // "task_created" | "task_assigned" | "task_status_changed" | "task_completed" | "message_sent" | "agent_joined" | "document_created"
    agentId: v.optional(v.id("agents")),
    taskId: v.optional(v.id("tasks")),
    message: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.optional(v.number()),
  }),

  // Documents: Deliverables and files
  documents: defineTable({
    title: v.string(),
    content: v.optional(v.string()),
    type: v.string(), // "deliverable" | "research" | "protocol" | "draft" | "other"
    taskId: v.optional(v.id("tasks")),
    agentId: v.optional(v.id("agents")),
    url: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }),

  // Notifications: @mentions and alerts
  notifications: defineTable({
    agentId: v.id("agents"),
    type: v.string(), // "mention" | "assignment" | "deadline" | "review_request"
    content: v.string(),
    taskId: v.optional(v.id("tasks")),
    read: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
  }),

  // Thread subscriptions: Auto-follow tasks you interact with
  subscriptions: defineTable({
    agentId: v.id("agents"),
    taskId: v.id("tasks"),
    subscribedAt: v.optional(v.number()),
  }),
});
