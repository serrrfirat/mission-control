# Multi-Agent Mission Control

A complete multi-agent orchestration system inspired by @pbteja1998's guide.

## Quick Start

### 1. Set up Convex Database

```bash
cd ~/.openclaw/workspace/mission-control
npx convex dev
```

This starts the Convex development server and creates the database.

### 2. Configure OpenClaw Crons

```bash
cd ~/.openclaw/workspace/mission-control/heartbeat
bash crons.sh
```

Or manually add each agent's cron job.

### 3. Copy Agent SOUL Files

```bash
cp -r ~/.openclaw/workspace/mission-control/agents/* ~/.openclaw/workspace/
```

### 4. Start Mission Control

```bash
cd ~/.openclaw/workspace/mission-control
npm run dev
```

## Agent Roster

| Agent | Role | Session Key |
|-------|------|-------------|
| Jarvis | Squad Lead | agent:main:main |
| Shuri | Product Analyst | agent:product-analyst:main |
| Fury | Customer Researcher | agent:customer-researcher:main |
| Vision | SEO Analyst | agent:seo-analyst:main |
| Loki | Content Writer | agent:content-writer:main |
| Quill | Social Media Manager | agent:social-media-manager:main |
| Wanda | Designer | agent:designer:main |
| Pepper | Email Marketing | agent:email-marketing:main |
| Friday | Developer | agent:developer:main |
| Wong | Documentation | agent:notion-agent:main |

## Directory Structure

```
mission-control/
├── agents/              ← SOUL files and AGENTS.md
│   ├── jarvis.md
│   ├── shuri.md
│   └── ...
├── convex/              ← Database schema and functions
│   ├── schema.ts
│   ├── functions.ts
│   └── convex.json
├── heartbeat/           ← Cron and heartbeat system
│   ├── HEARTBEAT.md
│   ├── crons.sh
│   ├── heartbeat.sh
│   ├── standup.sh
│   └── notify-daemon.sh
├── src/                 ← Mission Control React app
└── memory/              ← Agent memory (WORKING.md, etc.)
```

## Memory System

- **WORKING.md** — Current task state (read on every wake)
- **YYYY-MM-DD.md** — Daily notes
- **MEMORY.md** — Curated long-term memory

## Heartbeat Schedule

Agents wake every 15 minutes, staggered by 2 minutes:

- :00 — Jarvis
- :02 — Shuri
- :04 — Friday
- :06 — Loki
- :08 — Wanda
- :10 — Vision
- :12 — Fury
- :14 — Quill
- :16 — Pepper
- :18 — Wong

## Daily Standup

Jarvis generates a standup every day at 19:30 UTC (11:30 PM Dubai time).

## Credits

Built based on @pbteja1998's guide: https://x.com/pbteja1998/status/2017662163540971756
