import { NextRequest, NextResponse } from 'next/server';
import { gatewayCall } from '@/lib/gateway/client';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await gatewayCall('cron.run', { id });
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}
