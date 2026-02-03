/**
 * Notification Daemon
 *
 * Polls Convex for undelivered @mention notifications and delivers them
 * to the target agent via the /api/chat/{sessionKey} endpoint.
 *
 * Usage:
 *   npx tsx scripts/notification-daemon.ts
 *
 * Environment:
 *   CONVEX_URL         — Convex deployment URL (from .env.local)
 *   GATEWAY_BASE_URL   — Base URL for the Next.js app (default: http://localhost:3001)
 *   POLL_INTERVAL_MS   — Poll interval in ms (default: 30000)
 */

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

// Agent session key mapping (agentId → cron job ID → session key)
const AGENT_SESSION_KEYS: Record<string, string> = {
  jarvis: 'agent:main:cron:f2d55be7-3932-46a3-b830-810b7f375af0',
  shuri: 'agent:main:cron:012618a6-6196-4493-9a1f-80eaf0573652',
  friday: 'agent:main:cron:d0291808-9ddb-4277-8a98-339651bf62ec',
  loki: 'agent:main:cron:af7c0b7c-0d62-48c1-9ba0-09943e537540',
  wanda: 'agent:main:cron:8c1eadf6-cecf-4fea-8772-d8504e9f1d35',
  vision: 'agent:main:cron:a010dd8f-1348-4409-95b4-954f29c6578c',
  fury: 'agent:main:cron:0be0e054-27be-4f17-a10f-8fff8e51f88b',
  quill: 'agent:main:cron:669cc5f5-ce1b-4329-a50f-a30fca9b9319',
  pepper: 'agent:main:cron:e6d44c0e-862b-4572-a6a3-69fbf4ae3ed3',
  wong: 'agent:main:cron:b5ac7691-b7b6-4c94-a016-55aadbd610a4',
};

const CONVEX_URL = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL || '';
const GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL || 'http://localhost:3001';
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS) || 30_000;

if (!CONVEX_URL) {
  console.error('CONVEX_URL or NEXT_PUBLIC_CONVEX_URL must be set');
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function deliverNotification(
  agentId: string,
  content: string,
  fromAgentId: string,
  taskId: string,
): Promise<boolean> {
  const sessionKey = AGENT_SESSION_KEYS[agentId];
  if (!sessionKey) {
    console.warn(`No session key for agent: ${agentId}`);
    return false;
  }

  const message = `[Notification] @${agentId} mentioned by ${fromAgentId} on task ${taskId}: ${content}`;

  try {
    const res = await fetch(`${GATEWAY_BASE_URL}/api/chat/${sessionKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      console.warn(`Failed to deliver to ${agentId}: ${res.status} ${res.statusText}`);
      return false;
    }

    console.log(`Delivered notification to ${agentId}`);
    return true;
  } catch (err) {
    console.warn(`Error delivering to ${agentId}:`, err);
    return false;
  }
}

async function pollAndDeliver() {
  try {
    const notifications = await client.query(api.notifications.getUndelivered);

    if (notifications.length === 0) return;

    console.log(`Found ${notifications.length} undelivered notifications`);

    for (const notif of notifications) {
      const success = await deliverNotification(
        notif.mentionedAgentId,
        notif.content,
        notif.fromAgentId,
        notif.taskId,
      );

      if (success) {
        await client.mutation(api.notifications.markDelivered, {
          notificationId: notif._id,
        });
      }
    }
  } catch (err) {
    console.error('Poll error:', err);
  }
}

// Main loop
console.log(`Notification daemon started (poll every ${POLL_INTERVAL_MS / 1000}s)`);
console.log(`Convex: ${CONVEX_URL}`);
console.log(`Gateway: ${GATEWAY_BASE_URL}`);

pollAndDeliver();
setInterval(pollAndDeliver, POLL_INTERVAL_MS);
