import { NextResponse } from 'next/server';
import { gatewayCall, isGatewayConnected } from '@/lib/gateway/client';
import type { GatewayStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const connected = await isGatewayConnected();
    if (!connected) {
      return NextResponse.json(
        { error: 'Gateway not connected', online: false },
        { status: 503 }
      );
    }

    const status = await gatewayCall<GatewayStatus>('status');
    return NextResponse.json({ ...status, online: true });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message, online: false },
      { status: 500 }
    );
  }
}
