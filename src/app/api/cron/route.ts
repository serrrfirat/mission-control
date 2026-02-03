import { NextResponse } from 'next/server';
import { gatewayCall } from '@/lib/gateway/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await gatewayCall<{ jobs: unknown[] }>('cron.list');
    return NextResponse.json({ ok: true, jobs: result?.jobs ?? result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}
