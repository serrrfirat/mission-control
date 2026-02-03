import { NextRequest, NextResponse } from 'next/server';
import { gatewayCall } from '@/lib/gateway/client';
import { AGENT_ROSTER } from '@/lib/agents';
import type { CronJob } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface CronListResult {
  jobs: CronJob[];
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agent = AGENT_ROSTER.find((a) => a.id === id);
    if (!agent) {
      return NextResponse.json(
        { ok: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Get cron job data for heartbeat/enabled
    const cronResult = await gatewayCall<CronListResult>('cron.list');
    const jobs = cronResult?.jobs ?? [];
    const cronJob = jobs.find((j: CronJob) => j.id === agent.cronJobId);

    const payload = cronJob?.payload as Record<string, unknown> | undefined;
    const settings = {
      // From cron job
      heartbeatMs: cronJob?.schedule?.everyMs ?? 900000,
      enabled: cronJob?.enabled ?? true,
      // Cron job metadata
      lastRunAtMs: cronJob?.state?.lastRunAtMs,
      lastStatus: cronJob?.state?.lastStatus,
      lastDurationMs: cronJob?.state?.lastDurationMs,
      nextRunAtMs: cronJob?.state?.nextRunAtMs,
      // From cron payload
      systemPrompt: cronJob?.payload?.message ?? '',
      model: (payload?.model as string) ?? '',
    };

    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agent = AGENT_ROSTER.find((a) => a.id === id);
    if (!agent) {
      return NextResponse.json(
        { ok: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const results: Record<string, unknown> = {};

    const hasCronUpdate =
      body.heartbeatMs !== undefined ||
      body.enabled !== undefined ||
      body.systemPrompt !== undefined ||
      body.model !== undefined;

    if (hasCronUpdate) {
      const patch: Record<string, unknown> = {};

      if (body.enabled !== undefined) {
        patch.enabled = body.enabled;
      }

      if (body.heartbeatMs !== undefined) {
        patch.schedule = { kind: 'every', everyMs: body.heartbeatMs };
      }

      // Payload fields (model, systemPrompt) must be merged with existing payload
      if (body.systemPrompt !== undefined || body.model !== undefined) {
        // Fetch current payload to merge
        const cronResult = await gatewayCall<CronListResult>('cron.list');
        const jobs = cronResult?.jobs ?? [];
        const cronJob = jobs.find((j: CronJob) => j.id === agent.cronJobId);
        const currentPayload = (cronJob?.payload ?? {}) as Record<string, unknown>;

        const newPayload: Record<string, unknown> = {
          ...currentPayload,
        };
        if (body.systemPrompt !== undefined) {
          newPayload.message = body.systemPrompt;
        }
        if (body.model !== undefined) {
          if (body.model) {
            newPayload.model = body.model;
          } else {
            delete newPayload.model;
          }
        }
        patch.payload = newPayload;
      }

      results.cron = await gatewayCall('cron.update', {
        jobId: agent.cronJobId,
        patch,
      });
    }

    return NextResponse.json({ ok: true, results });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}
