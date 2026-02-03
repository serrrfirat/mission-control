// Server-side OpenClaw Gateway WebSocket client
// Ported from mission-control/src/lib/openclaw/client.ts

import { getGatewayToken, getGatewayUrl } from './token';
import { createConnectRequest, createRequest } from './protocol';
import type { GatewayMessage } from '../types';

class OpenClawClient {
  private ws: WebSocket | null = null;
  private pendingRequests = new Map<
    string,
    { resolve: (value: unknown) => void; reject: (error: Error) => void }
  >();
  private connected = false;
  private authenticated = false;
  private connecting: Promise<void> | null = null;
  private token = '';
  private url = '';

  async connect(): Promise<void> {
    if (this.connected && this.ws?.readyState === WebSocket.OPEN) return;
    if (this.connecting) return this.connecting;

    this.token = await getGatewayToken();
    this.url = getGatewayUrl();

    this.connecting = new Promise((resolve, reject) => {
      try {
        if (this.ws) {
          this.ws.onclose = null;
          this.ws.onerror = null;
          this.ws.onmessage = null;
          this.ws.onopen = null;
          if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
            this.ws.close();
          }
          this.ws = null;
        }

        const wsUrl = new URL(this.url);
        if (this.token) wsUrl.searchParams.set('token', this.token);
        this.ws = new WebSocket(wsUrl.toString());

        const timeout = setTimeout(() => {
          if (!this.connected) {
            this.ws?.close();
            this.connecting = null;
            reject(new Error('Connection timeout'));
          }
        }, 10000);

        this.ws.onopen = () => {
          // Wait for challenge, don't send anything yet
        };

        this.ws.onclose = () => {
          clearTimeout(timeout);
          this.connected = false;
          this.authenticated = false;
          this.connecting = null;
        };

        this.ws.onerror = () => {
          clearTimeout(timeout);
          if (!this.connected) {
            this.connecting = null;
            reject(new Error('Failed to connect to OpenClaw Gateway'));
          }
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data as string);

            // Handle challenge-response auth
            if (data.type === 'event' && data.event === 'connect.challenge') {
              const req = createConnectRequest(this.token);
              this.pendingRequests.set(req.id, {
                resolve: () => {
                  clearTimeout(timeout);
                  this.connected = true;
                  this.authenticated = true;
                  this.connecting = null;
                  resolve();
                },
                reject: (error: Error) => {
                  clearTimeout(timeout);
                  this.connecting = null;
                  this.ws?.close();
                  reject(new Error(`Auth failed: ${error.message}`));
                },
              });
              this.ws!.send(JSON.stringify(req));
              return;
            }

            this.handleMessage(data);
          } catch {
            // ignore parse errors
          }
        };
      } catch (err) {
        this.connecting = null;
        reject(err);
      }
    });

    return this.connecting;
  }

  private handleMessage(data: GatewayMessage): void {
    // Handle ResponseFrame (type: "res")
    if (data.type === 'res' && data.id !== undefined) {
      const pending = this.pendingRequests.get(String(data.id));
      if (pending) {
        this.pendingRequests.delete(String(data.id));
        if (data.ok === false && data.error) {
          pending.reject(new Error(data.error.message));
        } else {
          pending.resolve(data.payload);
        }
        return;
      }
    }

    // Legacy JSON-RPC
    if (data.id !== undefined && this.pendingRequests.has(String(data.id))) {
      const pending = this.pendingRequests.get(String(data.id))!;
      this.pendingRequests.delete(String(data.id));
      if (data.error) {
        pending.reject(new Error(data.error.message));
      } else {
        pending.resolve(data.result);
      }
    }
  }

  async call<T = unknown>(method: string, params?: Record<string, unknown>): Promise<T> {
    if (!this.connected || !this.authenticated || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    const req = createRequest(method, params);
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(req.id, {
        resolve: resolve as (value: unknown) => void,
        reject,
      });

      setTimeout(() => {
        if (this.pendingRequests.has(req.id)) {
          this.pendingRequests.delete(req.id);
          reject(new Error(`Request timeout: ${method}`));
        }
      }, 30000);

      this.ws!.send(JSON.stringify(req));
    });
  }

  isConnected(): boolean {
    return this.connected && this.authenticated && this.ws?.readyState === WebSocket.OPEN;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
    this.authenticated = false;
    this.connecting = null;
  }
}

// Singleton
let instance: OpenClawClient | null = null;

export function getClient(): OpenClawClient {
  if (!instance) {
    instance = new OpenClawClient();
  }
  return instance;
}

export async function gatewayCall<T = unknown>(method: string, params?: Record<string, unknown>): Promise<T> {
  const client = getClient();
  return client.call<T>(method, params);
}

export async function isGatewayConnected(): Promise<boolean> {
  try {
    const client = getClient();
    if (!client.isConnected()) {
      await client.connect();
    }
    return client.isConnected();
  } catch {
    return false;
  }
}
