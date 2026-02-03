import { NextResponse } from 'next/server';
import { isGatewayConnected } from '@/lib/gateway/client';

export async function GET() {
  const connected = await isGatewayConnected();
  return NextResponse.json({ ok: true, gateway: connected });
}
