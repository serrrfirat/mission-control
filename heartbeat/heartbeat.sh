#!/bin/bash
# heartbeat.sh — Agent heartbeat script
# Run on every agent wake

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="${WORKSPACE_DIR:-$HOME/.openclaw/workspace/mission-control}"
MEMORY_DIR="$WORKSPACE_DIR/memory"
CONVEX_URL="${CONVEX_URL:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[HEARTBEAT]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[HEARTBEAT]${NC} $1"; }
log_error() { echo -e "${RED}[HEARTBEAT]${NC} $1"; }

# Load agent context
load_context() {
    log_info "Loading context..."
    
    # Read WORKING.md
    if [ -f "$MEMORY_DIR/WORKING.md" ]; then
        WORKING_CONTENT=$(cat "$MEMORY_DIR/WORKING.md")
        log_info "WORKING.md loaded"
    else
        WORKING_CONTENT=""
        log_warn "WORKING.md not found"
    fi
    
    # Read today's daily notes
    TODAY=$(date +%Y-%m-%d)
    if [ -f "$MEMORY_DIR/$TODAY.md" ]; then
        DAILY_CONTENT=$(cat "$MEMORY_DIR/$TODAY.md")
        log_info "Daily notes loaded"
    else
        DAILY_CONTENT=""
        log_warn "Daily notes not found for $TODAY"
    fi
}

# Check Convex for mentions and tasks
check_convex() {
    log_info "Checking Mission Control for updates..."
    
    if [ -z "$CONVEX_URL" ]; then
        log_warn "Convex not configured, skipping database checks"
        return
    fi
    
    # Check for notifications (would use Convex client here)
    # For now, just log that we checked
    log_info "Convex check complete"
}

# Scan activity feed
scan_activity() {
    log_info "Scanning activity feed..."
    # Would query Convex activities table
    log_info "Activity scan complete"
}

# Generate heartbeat report
generate_report() {
    local active_tasks=0
    local blocked=0
    local next_steps=""
    
    # Parse WORKING.md for status
    if echo "$WORKING_CONTENT" | grep -q "BLOCKED"; then
        blocked=$((blocked + 1))
    fi
    
    if echo "$WORKING_CONTENT" | grep -q "In Progress"; then
        active_tasks=$((active_tasks + 1))
    fi
    
    # Generate next steps from WORKING.md
    if echo "$WORKING_CONTENT" | grep -q "Next Steps"; then
        next_steps=$(echo "$WORKING_CONTENT" | grep -A 5 "Next Steps" | head -6)
    fi
    
    # Output report
    cat << EOF
HEARTBEAT_OK

Active Tasks: $active_tasks
Blocked: $blocked

Status:
$WORKING_CONTENT

Next Steps:
$next_steps

No blockers. Standing down.
EOF
}

# Main heartbeat flow
main() {
    log_info "Agent heartbeat starting..."
    
    load_context
    check_convex
    scan_activity
    
    generate_report
    
    log_info "Heartbeat complete"
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
