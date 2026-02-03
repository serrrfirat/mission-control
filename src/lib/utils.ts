export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatRelativeTime(ms: number): string {
  const now = Date.now();
  const diff = now - ms;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const remainS = s % 60;
  return `${m}m ${remainS}s`;
}

export function formatInterval(ms: number): string {
  const minutes = ms / 60000;
  if (minutes < 60) return `${minutes}m`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours}h`;
  return `${hours / 24}d`;
}

export function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function extractSummary(text: string): string {
  let clean = text;
  clean = clean.replace(/\*+/g, '');
  clean = clean.replace(/^#+\s*/gm, '');
  clean = clean.replace(/`/g, '');
  clean = clean.replace(/[\u{1F300}-\u{1F9FF}\u2600-\u27BF\u2B50\u2705\u26A0\uFE0F\u23F8\u{1F534}\u{1F7E1}\u{1F7E2}]/gu, '');

  for (const line of clean.split('\n')) {
    const trimmed = line.trim().replace(/^-\s*/, '').trim();
    if (!trimmed) continue;
    if (trimmed === 'HEARTBEAT_OK' || trimmed === 'Cron') continue;
    const final = trimmed.replace(/^[\s\uFE0F]+/, '');
    if (final) return final;
  }
  return 'All nominal. Standing by.';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}
