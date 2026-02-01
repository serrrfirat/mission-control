import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============= AGENTS =============

export const getAgents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

export const getAgent = query({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getAgentBySessionKey = query({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    const agents = await ctx.db.query("agents").collect();
    return agents.find((a) => a.sessionKey === args.sessionKey);
  },
});

export const createAgent = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    avatarEmoji: v.optional(v.string()),
    sessionKey: v.string(),
    isMaster: v.optional(v.boolean()),
    soulFile: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("agents", {
      ...args,
      status: "idle",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateAgentStatus = mutation({
  args: { id: v.id("agents"), status: v.string(), currentTaskId: v.optional(v.id("tasks")) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      currentTaskId: args.currentTaskId,
      updatedAt: Date.now(),
    });
  },
});

// ============= TASKS =============

export const getTasks = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db.query("tasks").collect();
    }
    return await ctx.db.query("tasks").collect();
  },
});

export const getTasksByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("tasks").collect();
    return tasks.filter((t) => t.status === args.status);
  },
});

export const getTask = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    assigneeIds: v.optional(v.array(v.id("agents"))),
    creatorId: v.optional(v.id("agents")),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: "inbox",
      assigneeIds: args.assigneeIds,
      creatorId: args.creatorId,
      priority: args.priority || "normal",
      createdAt: now,
      updatedAt: now,
    });

    // Create activity
    await ctx.db.insert("activities", {
      type: "task_created",
      agentId: args.creatorId,
      taskId,
      message: `Task "${args.title}" created`,
      createdAt: now,
    });

    return taskId;
  },
});

export const updateTaskStatus = mutation({
  args: { id: v.id("tasks"), status: v.string(), agentId: v.optional(v.id("agents")) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const task = await ctx.db.get(args.id);
    if (!task) return;

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: now,
    });

    // Create activity
    await ctx.db.insert("activities", {
      type: args.status === "done" ? "task_completed" : "task_status_changed",
      agentId: args.agentId,
      taskId: args.id,
      message: `Task "${task.title}" moved to ${args.status}`,
      createdAt: now,
    });
  },
});

export const assignTask = mutation({
  args: {
    taskId: v.id("tasks"),
    assigneeIds: v.array(v.id("agents")),
    agentId: v.optional(v.id("agents")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const task = await ctx.db.get(args.taskId);
    if (!task) return;

    await ctx.db.patch(args.taskId, {
      assigneeIds: args.assigneeIds,
      status: task.status === "inbox" ? "assigned" : task.status,
      updatedAt: now,
    });

    // Create activity
    await ctx.db.insert("activities", {
      type: "task_assigned",
      agentId: args.agentId,
      taskId: args.taskId,
      message: `Task "${task.title}" assigned`,
      createdAt: now,
    });
  },
});

// ============= MESSAGES =============

export const getMessagesByTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const messages = await ctx.db.query("messages").collect();
    return messages
      .filter((m) => m.taskId === args.taskId)
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  },
});

export const createMessage = mutation({
  args: {
    taskId: v.id("tasks"),
    agentId: v.id("agents"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const messageId = await ctx.db.insert("messages", {
      taskId: args.taskId,
      agentId: args.agentId,
      content: args.content,
      createdAt: now,
    });

    const task = await ctx.db.get(args.taskId);
    const agent = await ctx.db.get(args.agentId);

    // Create activity
    await ctx.db.insert("activities", {
      type: "message_sent",
      agentId: args.agentId,
      taskId: args.taskId,
      message: `${agent?.name || "Agent"} commented on "${task?.title || "task"}"`,
      createdAt: now,
    });

    // Auto-subscribe agent to task
    const existing = await ctx.db.query("subscriptions").collect();
    const alreadySubscribed = existing.some(
      (s) => s.agentId === args.agentId && s.taskId === args.taskId
    );
    if (!alreadySubscribed) {
      await ctx.db.insert("subscriptions", {
        agentId: args.agentId,
        taskId: args.taskId,
        subscribedAt: now,
      });
    }

    return messageId;
  },
});

// ============= ACTIVITIES =============

export const getActivities = query({
  args: { limit: v.optional(v.number()), type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let activities = await ctx.db.query("activities").collect();
    
    if (args.type) {
      activities = activities.filter((a) => a.type === args.type);
    }
    
    return activities
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, args.limit || 50);
  },
});

// ============= NOTIFICATIONS =============

export const getNotifications = query({
  args: { agentId: v.id("agents"), unreadOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let notifications = await ctx.db.query("notifications").collect();
    notifications = notifications.filter((n) => n.agentId === args.agentId);
    
    if (args.unreadOnly) {
      notifications = notifications.filter((n) => !n.read);
    }
    
    return notifications.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  },
});

export const createNotification = mutation({
  args: {
    agentId: v.id("agents"),
    type: v.string(),
    content: v.string(),
    taskId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      agentId: args.agentId,
      type: args.type,
      content: args.content,
      taskId: args.taskId,
      read: false,
      createdAt: Date.now(),
    });
  },
});

export const markNotificationRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
  },
});

// ============= SUBSCRIPTIONS =============

export const getSubscriptions = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, args) => {
    const subs = await ctx.db.query("subscriptions").collect();
    return subs.filter((s) => s.agentId === args.agentId);
  },
});

export const subscribeToTask = mutation({
  args: { agentId: v.id("agents"), taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("subscriptions").collect();
    const alreadySubscribed = existing.some(
      (s) => s.agentId === args.agentId && s.taskId === args.taskId
    );
    if (!alreadySubscribed) {
      await ctx.db.insert("subscriptions", {
        agentId: args.agentId,
        taskId: args.taskId,
        subscribedAt: Date.now(),
      });
    }
  },
});

// ============= DOCUMENTS =============

export const getDocuments = query({
  args: { taskId: v.optional(v.id("tasks")), type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let docs = await ctx.db.query("documents").collect();
    
    if (args.taskId) {
      docs = docs.filter((d) => d.taskId === args.taskId);
    }
    if (args.type) {
      docs = docs.filter((d) => d.type === args.type);
    }
    
    return docs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  },
});

export const createDocument = mutation({
  args: {
    title: v.string(),
    content: v.optional(v.string()),
    type: v.string(),
    taskId: v.optional(v.id("tasks")),
    agentId: v.optional(v.id("agents")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const docId = await ctx.db.insert("documents", {
      title: args.title,
      content: args.content,
      type: args.type,
      taskId: args.taskId,
      agentId: args.agentId,
      createdAt: now,
      updatedAt: now,
    });

    if (args.agentId) {
      const agent = await ctx.db.get(args.agentId);
      await ctx.db.insert("activities", {
        type: "document_created",
        agentId: args.agentId,
        taskId: args.taskId,
        message: `${agent?.name || "Agent"} created document "${args.title}"`,
        createdAt: now,
      });
    }

    return docId;
  },
});
