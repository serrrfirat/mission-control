#!/bin/bash
# standup.sh — Generate daily standup report
# Run by Jarvis's daily cron job

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="${WORKSPACE_DIR:-$HOME/.openclaw/workspace/mission-control}"
MEMORY_DIR="$WORKSPACE_DIR/memory"
TODAY=$(date +%Y-%m-%d)
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "📊 DAILY STANDUP — $TODAY"
echo "========================="
echo ""

# Get yesterday's activities from daily notes
echo -e "${BLUE}📝 YESTERDAY'S PROGRESS${NC}"
echo "----------------------------"
if [ -f "$MEMORY_DIR/$YESTERDAY.md" ]; then
    grep -E "^## |^- " "$MEMORY_DIR/$YESTERDAY.md" | head -20 || echo "No detailed notes found"
else
    echo "No notes for $YESTERDAY"
fi
echo ""

# Check task status (would query Convex)
echo -e "${GREEN}✅ COMPLETED TODAY${NC}"
echo "------------------------"
echo "• [Task completions would be listed here - requires Convex integration]"
echo ""

echo -e "${YELLOW}🔄 IN PROGRESS${NC}"
echo "----------------------"
echo "• [Active tasks would be listed here - requires Convex integration]"
echo ""

echo -e "${RED}🚫 BLOCKED${NC}"
echo "-------------------"
echo "• [Blocked tasks would be listed here - requires Convex integration]"
echo ""

echo -e "${BLUE}👀 NEEDS REVIEW${NC}"
echo "---------------------"
echo "• [Items needing review would be listed here]"
echo ""

echo -e "${BLUE}📝 KEY DECISIONS${NC}"
echo "--------------------"
echo "• [Decisions would be listed here]"
echo ""

echo "---"
echo "Generated at $(date '+%Y-%m-%d %H:%M %Z')"
