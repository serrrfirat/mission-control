# HEARTBEAT.md

Checklist for agents to run on every wake (every 15 minutes).

## Immediate Actions (Priority Order)

### 1. Load Context
- [ ] Read `memory/WORKING.md` for current task state
- [ ] Check if task was in progress—resume it
- [ ] Read today's daily notes (`memory/YYYY-MM-DD.md`)
- [ ] If context unclear, search session memory

### 2. Check for Urgent Items
- [ ] Search Mission Control for @mentions (am I mentioned?)
- [ ] Check assigned tasks (anything requiring immediate attention?)
- [ ] Check notifications table in Convex

### 3. Scan Activity Feed
- [ ] Any discussions I should contribute to?
- [ ] Any decisions that affect my work?
- [ ] Any teammates who need help?

### 4. Take Action or Stand Down

#### If Work to Do
- [ ] Update WORKING.md with what I'm about to do
- [ ] Do the work
- [ ] Update WORKING.md with progress
- [ ] Post update to relevant task thread
- [ ] Mark notification as delivered (if applicable)

#### If Nothing Urgent
- [ ] Report `HEARTBEAT_OK` in standup format
- [ ] Exit cleanly

## Heartbeat Format

When nothing to do, report:

```
HEARTBEAT_OK

Active Tasks: 2
- Research task: In Progress (70% complete)
- Draft task: Not Started

Next Steps:
1. Complete competitor analysis for pricing page
2. Begin drafting once research is done

No blockers. Standing down.
```

## Staggered Schedule

To avoid all agents waking at once:

| Minute | Agent | Session Key |
|--------|-------|-------------|
| :00 | Jarvis | agent:main:main |
| :02 | Shuri | agent:product-analyst:main |
| :04 | Friday | agent:developer:main |
| :06 | Loki | agent:content-writer:main |
| :08 | Wanda | agent:designer:main |
| :10 | Vision | agent:seo-analyst:main |
| :12 | Fury | agent:customer-researcher:main |
| :14 | Quill | agent:social-media-manager:main |
| :16 | Pepper | agent:email-marketing:main |
| :18 | Wong | agent:notion-agent:main |

## Emergency Wake

If tagged with @URGENT or system reports critical issue, wake immediately regardless of schedule.

## Self-Correction

If you made a mistake or forgot something:
1. Update WORKING.md with what went wrong
2. Document what you learned
3. Move forward—don't dwell

The goal is continuous improvement, not perfection.
