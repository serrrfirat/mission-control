# Claw Control

Mobile command center for managing and monitoring OpenClaw AI agents. A PWA dashboard that provides real-time agent oversight, chat, scheduling, task management, and activity monitoring.

## Architecture

```
 PHONE (LAN)              MAC MINI                          CONVEX (LOCAL/CLOUD)
+--------------+    +---------------------------+    +------------------------+
| Claw Control |    | Next.js (port 3001)       |    | 6 tables:              |
| PWA          |--->|   ConvexProvider (react)   |--->|   agents, tasks,       |
|              |    |   /api/gateway/* (proxy)   |    |   messages, activities,|
+--------------+    |   /api/chat/*              |    |   documents,           |
                    |   /api/cron/*              |    |   notifications        |
                    |           |                |    +------------------------+
                    |           v                |           ^
                    |   OpenClaw Gateway :18789  |           |
                    |     (WebSocket RPC)        |    Convex subscriptions
                    |           |                |    (real-time sync)
                    |   Notification Daemon      |
                    |   (polls & delivers)       |
                    +---------------------------+
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, glass morphism design |
| Client State | Zustand 5 (gateway, agents, feed, cron) |
| Database | Convex (tasks, messages, activities, documents, notifications) |
| Icons | Lucide React |
| Gateway | WebSocket RPC to OpenClaw (port 18789) |
| PWA | Service worker, manifest, installable |

## Features

### Squad Overview (`/`)

Dashboard showing all 10 AI agents with real-time status indicators. Each agent card displays name, role, emoji, and current status (idle/working/offline). Statuses update every 10 seconds by polling the OpenClaw gateway for active sessions.

**Agents:** Jarvis (Squad Lead), Shuri (Product Analyst), Friday (Developer), Loki (Content Writer), Wanda (Designer), Vision (SEO Analyst), Fury (Researcher), Quill (Social Media), Pepper (Email Marketing), Wong (Documentation)

### Live Monitor (`/monitor`)

Real-time activity feed merging two sources:
- **Gateway events** — cron output, session activity, Telegram messages, errors (polled every 10s)
- **Convex activities** — task status changes, comments, document creation (real-time subscriptions)

Events are color-coded by source and sorted newest-first. Task-related activities link directly to the task detail page.

### Chat (`/chat`)

Per-agent chat interface. Select an agent to open a conversation backed by the OpenClaw gateway's `chat.history` / `chat.send` RPC methods. Messages poll every 3 seconds with optimistic UI updates.

### Agent Settings (`/chat/[agentId]/settings`)

Per-agent configuration:
- **Identity** — customize name, emoji, role (persisted locally)
- **Status** — enable/disable the agent
- **Heartbeat** — interval between scheduled wake-ups (5m to 24h)
- **Model** — select LLM (Kimi K2.5, MiniMax M2.1, Gemini 3 Pro, Claude Opus 4.5)
- **Temperature** — 0.0 to 1.0 slider
- **System Prompt** — up to 4000 characters

Settings persist to the gateway via cron job payload updates.

### Schedule (`/schedule`)

View and manage cron jobs. Separates agent heartbeats from other scheduled jobs. Each job card shows:
- Name, interval, last run time, status
- Toggle enabled/disabled
- "Run Now" for immediate execution
- Interval picker (5m to 24h presets)

### Task Board (`/tasks`)

5-column Kanban board backed by Convex for real-time sync:

```
Inbox → Assigned → In Progress → Review → Done
```

Tasks support:
- **Multi-agent assignment** — assign one or more agents to a task
- **Priority levels** — low, medium, high, urgent
- **Forward/back navigation** — move tasks through the pipeline with arrow buttons
- **Real-time updates** — changes sync instantly across all connected clients via Convex subscriptions

### Task Detail (`/tasks/[taskId]`)

Full task view with:
- **Editable title and description**
- **Status flow** — click any status to jump directly
- **Assignee management** — multi-select agent picker
- **Comment thread** — agents comment on tasks with `@mention` support
- **@mention notifications** — mentioning an agent creates a notification delivered to their session by the notification daemon
- **Activity timeline** — task-scoped history of status changes and comments

### Notification Daemon (`scripts/notification-daemon.ts`)

Background process that polls Convex every 30 seconds for undelivered `@mention` notifications and delivers them to the target agent's chat session via `POST /api/chat/{sessionKey}`.

## Convex Schema

Six tables powering collaborative task management:

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `agents` | Agent registry (seeded from roster) | agentId, name, role, emoji, status |
| `tasks` | Task lifecycle (5-state flow) | title, status, assigneeIds, priority |
| `messages` | Comment threads on tasks | taskId, fromAgentId, content, mentions |
| `activities` | Audit log / activity feed | type, agentId, taskId, message |
| `documents` | Docs attached to tasks | title, content, type, taskId |
| `notifications` | @mention delivery queue | mentionedAgentId, content, delivered |

Activities are auto-created when tasks are created, assigned, moved, deleted, or commented on. Notifications are auto-created when `@agent` mentions are detected in comments.

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check (returns gateway status) |
| `/api/gateway/status` | GET | Gateway sessions, channels, queued events |
| `/api/gateway/call` | POST | Generic RPC proxy to gateway |
| `/api/chat/[sessionKey]` | GET | Chat history for agent session |
| `/api/chat/[sessionKey]` | POST | Send message to agent |
| `/api/agent/[id]/settings` | GET/PUT | Agent settings (model, prompt, heartbeat) |
| `/api/cron` | GET | List all cron jobs |
| `/api/cron/[id]` | PATCH/DELETE | Update or delete a cron job |
| `/api/cron/[id]/run` | POST | Trigger immediate execution |

## Project Structure

```
src/
  app/
    layout.tsx                    # Root layout (PWA meta, service worker)
    (dashboard)/
      layout.tsx                  # Dashboard shell (ConvexProvider, Header, BottomNav)
      page.tsx                    # Squad overview
      monitor/page.tsx            # Live activity feed
      chat/page.tsx               # Agent chat list
      chat/[agentId]/page.tsx     # Agent conversation
      chat/[agentId]/settings/    # Agent settings
      schedule/page.tsx           # Cron job management
      tasks/page.tsx              # 5-column task board
      tasks/[taskId]/page.tsx     # Task detail + comments
    api/                          # Next.js API routes (gateway proxy)
  components/
    agents/                       # AgentCard, AgentGrid, AgentAvatar
    chat/                         # ChatBubble, ChatInput, ChatThread
    layout/                       # Header, BottomNav, StatusPill
    monitor/                      # LiveFeed, FeedItem
    schedule/                     # CronJobCard, IntervalPicker, RunButton
    settings/                     # ModelSelect, TemperatureSlider, SystemPromptEditor
    shared/                       # EmptyState, Toast, Skeleton
    tasks/                        # TaskBoard, TaskCard, TaskForm, TaskDetail,
                                  # TaskComments, CommentBubble, TaskStatusBadge,
                                  # AssigneePicker
  lib/
    agents.ts                     # AGENT_ROSTER (10 agents), lookup helpers
    store.ts                      # Zustand store (gateway, agents, feed, cron)
    types.ts                      # All TypeScript interfaces
    utils.ts                      # Formatting, ID generation, class names
    convex/provider.tsx           # ConvexClientProvider wrapper
    gateway/                      # WebSocket client, protocol frames, token reader
    hooks/                        # useAgents, useChatHistory, useCronJobs,
                                  # useGatewayStatus, useAgentSettings,
                                  # useTasks, useTaskDetail, useActivities
convex/
  schema.ts                       # 6-table schema definition
  agents.ts                       # Agent registry functions
  tasks.ts                        # Task CRUD + status flow
  messages.ts                     # Comment threads + @mention detection
  activities.ts                   # Activity feed
  documents.ts                    # Document management
  notifications.ts                # @mention delivery queue
  seed.ts                         # Seed 10 agents from roster
scripts/
  notification-daemon.ts          # Polls & delivers @mention notifications
```

## Getting Started

### Prerequisites

- Node.js 18+
- OpenClaw Gateway running on port 18789 (for agent features)
- Convex account (for task management)

### Installation

```bash
npm install
```

### Start Convex

```bash
npx convex dev
```

This starts the local Convex backend, creates the deployment, and generates types. Keep it running.

### Seed the Database

In a second terminal:

```bash
npx convex run seed:init
```

Populates the agents table with all 10 agents.

### Start Next.js

```bash
npm run dev
```

App runs on [http://localhost:3001](http://localhost:3001).

### Start Notification Daemon (Optional)

```bash
npx tsx scripts/notification-daemon.ts
```

Delivers `@mention` notifications from task comments to agent chat sessions every 30 seconds.

### Verify

1. Open [http://localhost:3001/tasks](http://localhost:3001/tasks) — task board with 5 columns
2. Create a task — appears in Convex dashboard and syncs in real-time
3. Open monitor — gateway events + task activities merged
4. `npx convex run tasks:list` — same tasks visible from CLI

## Agent CLI Integration

Agents can interact with the task board via Convex CLI:

```bash
# Check assigned tasks
npx convex run tasks:getForAgent '{"agentId":"friday"}'

# Update task status
npx convex run tasks:moveStatus '{"taskId":"...","status":"in_progress"}'

# Add a comment
npx convex run messages:create '{"taskId":"...","fromAgentId":"friday","content":"Done with implementation"}'

# Create a document
npx convex run documents:create '{"title":"API Spec","content":"...","type":"spec","taskId":"...","createdBy":"friday"}'

# Mention another agent (triggers notification)
npx convex run messages:create '{"taskId":"...","fromAgentId":"friday","content":"@jarvis ready for review"}'
```

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL | Set by `npx convex dev` |
| `CONVEX_DEPLOYMENT` | Convex deployment identifier | Set by `npx convex dev` |
| `OPENCLAW_GATEWAY_URL` | Gateway WebSocket URL | `ws://127.0.0.1:18789` |
| `GATEWAY_BASE_URL` | Next.js base URL (for daemon) | `http://localhost:3001` |
| `POLL_INTERVAL_MS` | Daemon poll interval | `30000` |
