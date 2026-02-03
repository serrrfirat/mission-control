// OpenClaw Gateway RPC protocol helpers

export interface RequestFrame {
  type: 'req';
  id: string;
  method: string;
  params?: Record<string, unknown>;
}

export interface ResponseFrame {
  type: 'res';
  id: string;
  ok: boolean;
  payload?: unknown;
  error?: { code?: number; message: string };
}

export interface EventFrame {
  type: 'event';
  event: string;
  payload?: unknown;
}

export interface ConnectRequest {
  type: 'req';
  id: string;
  method: 'connect';
  params: {
    minProtocol: number;
    maxProtocol: number;
    client: {
      id: string;
      version: string;
      platform: string;
      mode: string;
    };
    auth: {
      token: string;
    };
  };
}

export function createRequest(method: string, params?: Record<string, unknown>): RequestFrame {
  return {
    type: 'req',
    id: crypto.randomUUID(),
    method,
    params,
  };
}

export function createConnectRequest(token: string): ConnectRequest {
  return {
    type: 'req',
    id: crypto.randomUUID(),
    method: 'connect',
    params: {
      minProtocol: 3,
      maxProtocol: 3,
      client: {
        id: 'gateway-client',
        version: '1.0.0',
        platform: 'web',
        mode: 'ui',
      },
      auth: { token },
    },
  };
}
