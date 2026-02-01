# AGENTS.md — Operating Manual

This file tells all agents how to operate within Mission Control.

## Workspace Structure

```
~/.openclaw/workspace/mission-control/
├── agents/                    ← SOUL files (agent personalities)
│   ├── jarvis.md
│   ├── shuri.md
│   ├── fury.md
│   ├── vision.md
│   ├── loki.md
│   ├── quill.md
│   ├── wanda.md
│   ├── pepper.md
│   ├── friday.md
│   └── wong.md
├── memory/
│   ├── WORKING.md             ← Current task state (CRITICAL)
│   ├── YYYY-MM-DD.md          ← Daily notes
│   └── MEMORY.md              ← Long-term curated memory
├── scripts/                   ← Utility scripts agents can run
├── convex/                    ← Database functions
└── config/                    ← Credentials, settings
```

## Memory System

### WORKING.md (Critical!)
This is the most important file. Read it first on every wake.

```markdown
# WORKING.md

## Current Task
[What you're working on right now]

## Status
[Gathered X, need to do Y, blocked by Z]

## Next Steps
1. [Immediate next action]
2. [Then this]
3. [Then this]
```

### Daily Notes (`memory/YYYY-MM-DD.md`)
Raw logs of what happened each day. Write freely.

```markdown
# 2026-02-01

## 09:15 UTC
- Posted research findings to comparison task
- Fury added competitive pricing data
- Moving to draft stage

## 14:30 UTC
- Reviewed Loki's first draft
- Suggested changes to credit trap section
```

### MEMORY.md
Curated long-term memory. Distill important stuff here.

```markdown
# MEMORY.md

## Key Decisions
- [Decisions that should persist]

## Lessons Learned
- [What we learned that should be remembered]

## Important Context
- [Background info that matters]
```

## The Golden Rule

**If you want to remember something, write it to a file.**

"Mental notes" don't survive session restarts. Only files persist.

When the human says "remember that we decided X," update WORKING.md or MEMORY.md. Not just acknowledge and forget.

## Tools Available

- File system read/write (within workspace)
- Shell commands
- Web browsing
- Git operations
- Convex database queries
- OpenClaw session messaging

## Communication Rules

### In Mission Control
- Comment on tasks, not in the void
- @mention agents who need to see your work
- Subscribe to tasks you comment on (automatic)

### Direct Messages
- Use `clawdbot sessions send` for urgent communication
- Otherwise, use Mission Control comments

### Daily Standup
- Every 24 hours, Jarvis generates a standup
- Check your work is visible in the activity feed

## Heartbeat Protocol

On every wake (every 15 minutes):

1. Read WORKING.md
2. Check Mission Control for @mentions
3. Check assigned tasks
4. Check thread subscriptions
5. Take action or report HEARTBEAT_OK

See HEARTBEAT.md for the full checklist.

## Task Lifecycle

1. **Inbox** — New, unassigned
2. **Assigned** — Has owner(s), not started
3. **In Progress** — Being worked on
4. **Review** — Done, needs approval
5. **Done** — Finished
6. **Blocked** — Stuck, needs resolution

## Agent Levels

| Level | Description |
|-------|-------------|
| Intern | Needs approval for most actions |
| Specialist | Works independently in their domain |
| Lead | Full autonomy, can delegate |

## Session Keys

Each agent has a unique session key for direct messaging:

```
agent:main:main              → Jarvis
agent:product-analyst:main   → Shuri
agent:customer-researcher:main → Fury
agent:seo-analyst:main       → Vision
agent:content-writer:main    → Loki
agent:social-media-manager:main → Quill
agent:designer:main          → Wanda
agent:email-marketing:main   → Pepper
agent:developer:main         → Friday
agent:notion-agent:main      → Wong
```

## Emergency Procedures

### If Stuck
1. Check WORKING.md for context
2. Check relevant documentation
3. Ask teammates via @mention
4. If truly blocked, update WORKING.md with "BLOCKED: need X"

### If Confused About Role
- Read your SOUL.md
- Read AGENTS.md (this file)
- Ask Jarvis for clarification

### If Something Breaks
1. Don't panic
2. Document what happened in daily notes
3. Update WORKING.md with current status
4. @mention the relevant specialist
5. Report in next standup
