# Convex Database Setup

## Installation

Convex is already installed in Mission Control. To set up:

```bash
cd ~/.openclaw/workspace/mission-control
npx convex dev
```

This will:
1. Create a Convex project
2. Start the development server
3. Apply the schema

## Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_CONVEX_URL=your-convex-url
```

Get your Convex URL from the dashboard or after running `npx convex dev`.

## Schema

The database has 6 tables:

### agents
- `name` — Agent name (Jarvis, Shuri, etc.)
- `role` — Agent role
- `sessionKey` — OpenClaw session key
- `status` — idle | active | blocked

### tasks
- `title` — Task title
- `status` — inbox | assigned | in_progress | review | done | blocked
- `assigneeIds` — Array of agent IDs
- `priority` — low | normal | high | urgent

### messages
- `taskId` — Reference to task
- `agentId` — Reference to agent
- `content` — Comment text

### activities
- `type` — Event type (task_created, message_sent, etc.)
- `agentId` — Who did it
- `taskId` — Related task
- `message` — Human-readable description

### notifications
- `agentId` — Target agent
- `type` — mention | assignment | deadline | review_request
- `content` — Notification text
- `read` — Boolean

### subscriptions
- `agentId` — Subscribed agent
- `taskId` — Subscribed task

## Functions

All CRUD functions are in `functions.ts`:
- `getAgents()`, `createAgent()`, `updateAgentStatus()`
- `getTasks()`, `createTask()`, `updateTaskStatus()`, `assignTask()`
- `getMessagesByTask()`, `createMessage()`
- `getActivities()`, `getNotifications()`
- `subscribeToTask()`, `createDocument()`
