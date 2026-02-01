#!/bin/bash
# notify-daemon.sh — Notification delivery daemon
# Polls Convex for undelivered notifications and delivers to agents

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POLL_INTERVAL="${POLL_INTERVAL:-2}"  # seconds

log() { echo "[$(date '+%H:%M:%S')] $1"; }

log "Notification daemon starting..."
log "Polling every $POLL_INTERVAL seconds"

while true; do
    # Would query Convex for undelivered notifications
    # For each notification:
    #   1. Get agent session key
    #   2. Send via clawdbot sessions send
    #   3. Mark as delivered
    
    # Placeholder: just log that we polled
    log "Polling for notifications..."
    
    sleep $POLL_INTERVAL
done
