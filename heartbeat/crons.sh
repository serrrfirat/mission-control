# OpenClaw Cron Configuration for Multi-Agent System
# Run: clawdbot cron add [options]

# Jarvis - Squad Lead (:00)
clawdbot cron add \
  --name "jarvis-heartbeat" \
  --cron "0,15,30,45 * * * *" \
  --session "isolated" \
  --payload '{"kind": "systemEvent", "text": "You are Jarvis, the Squad Lead. Check Mission Control for @mentions, assigned tasks, and team updates. Read memory/WORKING.md. If nothing urgent, report HEARTBEAT_OK."}' \
  --sessionTarget "isolated"

# Shuri - Product Analyst (:02)
clawdbot cron add \
  --name "shuri-heartbeat" \
  --cron "2,17,32,47 * * * *" \
  --session "isolated" \
  --payload '{"kind": "systemEvent", "text": "You are Shuri, the Product Analyst. Check for testing tasks, UX reviews, and competitive analysis requests. Read memory/WORKING.md. If nothing urgent, report HEARTBEAT_OK."}' \
  --sessionTarget "isolated"

# Friday - Developer (:04)
clawdbot cron add \
  --name "friday-heartbeat" \
  --cron "4,19,34,49 * * * *" \
  --session "isolated" \
  --payload '{"kind": "systemEvent", "text": "You are Friday, the Developer. Check for code reviews, technical tasks, and bug fixes. Read memory/WORKING.md. If nothing urgent, report HEARTBEAT_OK."}' \
  --sessionTarget "isolated"

# Loki - Content Writer (:06)
clawdbot cron add \
  --name "loki-heartbeat" \
  --cron "6,21,36,51 * * * *" \
  --session "isolated" \
  --payload '{"kind": "systemEvent", "text": "You are Loki, the Content Writer. Check for drafting tasks, content reviews, and editing requests. Read memory/WORKING.md. If nothing urgent, report HEARTBEAT_OK."}' \
  --sessionTarget "isolated"

# Wanda - Designer (:08)
clawdbot cron add \
  --name "wanda-heartbeat" \
  --cron "8,23,38,53 * * * *" \
  --session "isolated" \
  --payload '{"kind": "systemEvent", "text": "You are Wanda, the Designer. Check for design tasks, visual requests, and creative work. Read memory/WORKING.md. If nothing urgent, report HEARTBEAT_OK."}' \
  --sessionTarget "isolated"

# Vision - SEO Analyst (:10)
clawdbot cron add \
  --name "vision-heartbeat" \
  --cron "10,25,40,55 * * * *" \
  --session "isolated" \
  --payload '{"kind": "systemEvent", "text": "You are Vision, the SEO Analyst. Check for keyword research, content optimization, and SEO tasks. Read memory/WORKING.md. If nothing urgent, report HEARTBEAT_OK."}' \
  --sessionTarget "isolated"

# Fury - Customer Researcher (:12)
clawdbot cron add \
  --name "fury-heartbeat" \
  --cron "12,27,42,57 * * * *" \
  --session "isolated" \
  --payload '{"kind": "systemEvent", "text": "You are Fury, the Customer Researcher. Check for research requests, competitive analysis, and customer feedback tasks. Read memory/WORKING.md. If nothing urgent, report HEARTBEAT_OK."}' \
  --sessionTarget "isolated"

# Quill - Social Media Manager (:14)
clawdbot cron add \
  --name "quill-heartbeat" \
  --cron "14,29,44,59 * * * *" \
  --session "isolated" \
  --payload '{"kind": "systemEvent", "text": "You are Quill, the Social Media Manager. Check for social content tasks, engagement requests, and campaign work. Read memory/WORKING.md. If nothing urgent, report HEARTBEAT_OK."}' \
  --sessionTarget "isolated"

# Pepper - Email Marketing (:16)
clawdbot cron add \
  --name "pepper-heartbeat" \
  --cron "16,31,46 * * * *" \
  --session "isolated" \
  --payload '{"kind": "systemEvent", "text": "You are Pepper, the Email Marketing Specialist. Check for email sequence tasks, drip campaigns, and lifecycle messaging. Read memory/WORKING.md. If nothing urgent, report HEARTBEAT_OK."}' \
  --sessionTarget "isolated"

# Wong - Documentation (:18)
clawdbot cron add \
  --name "wong-heartbeat" \
  --cron "18,33,48 * * * *" \
  --session "isolated" \
  --payload '{"kind": "systemEvent", "text": "You are Wong, the Documentation Specialist. Check for documentation tasks, knowledge transfer requests, and organizational work. Read memory/WORKING.md. If nothing urgent, report HEARTBEAT_OK."}' \
  --sessionTarget "isolated"

# Daily Standup - Jarvis generates at 11:30 PM Dubai time (19:30 UTC)
clawdbot cron add \
  --name "daily-standup" \
  --cron "30 19 * * *" \
  --session "agent:main:main" \
  --payload '{"kind": "systemEvent", "text": "Generate the daily standup. Check each agent session for recent activity. Compile: completed today, in progress, blocked, needs review, key decisions. Send to human via configured channel."}' \
  --sessionTarget "main"
