import { readFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

let cachedToken: string | null = null;

export async function getGatewayToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  try {
    const configPath = join(homedir(), '.openclaw', 'openclaw.json');
    const raw = await readFile(configPath, 'utf-8');
    const config = JSON.parse(raw);
    cachedToken = config?.gateway?.auth?.token || '';
    return cachedToken as string;
  } catch {
    return '';
  }
}

export function getGatewayUrl(): string {
  return process.env.OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789';
}

export function getGatewayPort(): number {
  return parseInt(process.env.OPENCLAW_GATEWAY_PORT || '18789', 10);
}
