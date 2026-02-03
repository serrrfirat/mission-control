// Gateway protocol types

export interface GatewayMessage {
  type?: string;
  id?: string | number;
  method?: string;
  params?: Record<string, unknown>;
  result?: unknown;
  payload?: unknown;
  ok?: boolean;
  error?: { code?: number; message: string };
  event?: string;
}

export interface GatewaySessionInfo {
  id: string;
  key: string;
  channel: string;
  peer?: string;
  model?: string;
  status: string;
  age?: number;
  updatedAt?: number;
  totalTokens?: number;
}

export interface GatewayStatus {
  sessions: {
    count: number;
    recent: GatewaySessionInfo[];
  };
  channelSummary: string[];
  queuedSystemEvents: string[];
  uptime?: number;
}

// Agent types

export type AgentStatus = 'idle' | 'working' | 'offline';

export interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  cronJobId: string;
  status: AgentStatus;
  lastActivity?: string;
  lastActivityTime?: number;
  settings?: AgentSettings;
}

// Agent settings types

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
}

export const LLM_MODELS: LLMModel[] = [
  { id: 'kimi-coding/kimi-k2.5', name: 'Kimi K2.5', provider: 'Kimi' },
  { id: 'minimax/MiniMax-M2.1', name: 'MiniMax M2.1', provider: 'MiniMax' },
  { id: 'google/gemini-3-pro-preview', name: 'Gemini 3 Pro', provider: 'Google' },
  { id: 'opencode/claude-opus-4-5', name: 'Claude Opus 4.5', provider: 'OpenCode' },
];

export interface AgentSettings {
  // Server-side (via gateway RPC)
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  heartbeatMs?: number;
  enabled?: boolean;
}

// Cron job types

export interface CronJobSchedule {
  kind: 'every' | 'cron';
  everyMs?: number;
  expr?: string;
  tz?: string;
}

export interface CronJobState {
  nextRunAtMs?: number;
  lastRunAtMs?: number;
  lastStatus?: string;
  lastDurationMs?: number;
}

export interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: CronJobSchedule;
  sessionTarget: string;
  wakeMode: string;
  payload: {
    kind: string;
    message?: string;
    text?: string;
    channel?: string;
  };
  isolation?: {
    postToMainPrefix?: string;
    postToMainMode?: string;
    postToMainMaxChars?: number;
  };
  state: CronJobState;
  createdAtMs: number;
  updatedAtMs: number;
}

export interface CronJobsFile {
  version: number;
  jobs: CronJob[];
}

// Chat types

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// Feed types

export interface FeedItem {
  id: string;
  timestamp: number;
  source: string;
  summary: string;
  type?: 'cron' | 'session' | 'telegram' | 'gateway' | 'error' | 'activity';
  taskId?: string;
}

// Task board types (Convex-backed, 5-state flow)

export type TaskStatus = 'inbox' | 'assigned' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  assigneeIds: string[];
  createdBy?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  _id: string;
  taskId: string;
  fromAgentId: string;
  content: string;
  mentions: string[];
  createdAt: number;
}

export interface Activity {
  _id: string;
  type: string;
  agentId?: string;
  taskId?: string;
  message: string;
  createdAt: number;
}

export interface Document {
  _id: string;
  title: string;
  content: string;
  type: 'note' | 'spec' | 'report' | 'artifact';
  taskId?: string;
  createdBy?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Notification {
  _id: string;
  mentionedAgentId: string;
  fromAgentId: string;
  taskId: string;
  messageId: string;
  content: string;
  delivered: boolean;
  createdAt: number;
}
