import { NextRequest, NextResponse } from 'next/server';
import { gatewayCall } from '@/lib/gateway/client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, params } = body;

    if (!method) {
      return NextResponse.json({ error: 'method is required' }, { status: 400 });
    }

    const result = await gatewayCall(method, params);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}
