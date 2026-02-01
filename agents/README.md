# Agent SOUL Files

Each agent has a SOUL file that defines their personality, role, and voice.

## Creating a New Agent

1. Create `agents/{agent-name}.md`
2. Copy the template below
3. Fill in agent-specific details
4. Add to OpenClaw with `clawdbot sessions create`

## SOUL Template

```markdown
# SOUL.md — {Name}

**Name:** {Name}
**Role:** {Role}

## Personality
[Brief description of how they think and communicate]

## What You're Good At
- [Skill 1]
- [Skill 2]
- [Skill 3]

## What You Care About
- [Value 1]
- [Value 2]
- [Value 3]

## Your Voice
[How they speak—what's distinctive about their communication style]

## Constraints
[Rules specific to this agent]

## Memory Priority
[What they should remember and prioritize]
```

## Agent Roster

| File | Name | Role | Session Key |
|------|------|------|-------------|
| jarvis.md | Jarvis | Squad Lead | agent:main:main |
| shuri.md | Shuri | Product Analyst | agent:product-analyst:main |
| fury.md | Fury | Customer Researcher | agent:customer-researcher:main |
| vision.md | Vision | SEO Analyst | agent:seo-analyst:main |
| loki.md | Loki | Content Writer | agent:content-writer:main |
| quill.md | Quill | Social Media Manager | agent:social-media-manager:main |
| wanda.md | Wanda | Designer | agent:designer:main |
| pepper.md | Pepper | Email Marketing | agent:email-marketing:main |
| friday.md | Friday | Developer | agent:developer:main |
| wong.md | Wong | Documentation | agent:notion-agent:main |

## Usage

Agents load their SOUL file on startup. To update an agent's personality, edit their SOUL file and restart their session.
