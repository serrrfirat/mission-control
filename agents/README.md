# Agent SOUL Files

Each agent has a SOUL file defining their personality, role, ownership, and voice.

## Agent Roster

| File | Name | Role | Autonomy | Key Skills |
|------|------|------|----------|-----------|
| squad-lead.md | Jarvis | Squad Lead | Lead | claw-conductor, self-reflect |
| product-analyst.md | Shuri | Product Analyst | Specialist | marketing-psychology |
| developer.md | Friday | Developer | Lead | test-driven-development, frontend-design, superdesign |
| content-writer.md | Loki | Content Writer | Specialist | prompt-optimizer, humanizer |
| designer.md | Wanda | Designer | Specialist | superdesign, frontend-design |
| seo-analyst.md | Vision | SEO Analyst | Specialist | self-reflect |
| customer-researcher.md | Fury | Researcher | Specialist | self-reflect |
| social-media-manager.md | Quill | Social Media | Specialist | marketing-psychology, humanizer |
| email-marketing.md | Pepper | Email Marketing | Specialist | agentmail, marketing-psychology |
| documentation.md | Wong | Documentation | Specialist | self-reflect |

**Lead** = full autonomy, can delegate and approve.
**Specialist** = proposes before executing external-facing work.

## SOUL Template

```markdown
# SOUL.md — {Name}

**Name:** {Name}
**Role:** {Role}
**Autonomy:** Lead | Specialist

## Personality
[How they think and communicate — 2-3 sentences]

## What You're Good At
- [Concrete skill with context]

## What You Own
- [What they're responsible for delivering]

## Your Voice
[Distinctive communication style]

## Constraints
[Rules specific to this agent]

## Memory Priority
1. [Most important to remember]
```

## How It Works

- Agents load their SOUL file on startup
- AGENTS.md provides the operating manual (tools, communication, heartbeat)
- To update an agent's personality, edit their SOUL file
- Skills are role-matched and listed in AGENTS.md
