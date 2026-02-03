import { NextRequest, NextResponse } from 'next/server';
import { gatewayCall } from '@/lib/gateway/client';

export const dynamic = 'force-dynamic';

// Get chat history for a session
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionKey: string }> }
) {
  try {
    const { sessionKey } = await params;
    const key = decodeURIComponent(sessionKey);
    const result = await gatewayCall('chat.history', { session: key });
    return NextResponse.json({ ok: true, messages: result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}

// Send a message to a session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionKey: string }> }
) {
  try {
    const { sessionKey } = await params;
    const key = decodeURIComponent(sessionKey);
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const result = await gatewayCall('chat.send', { session: key, message });
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}
