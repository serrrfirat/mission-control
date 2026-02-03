import { Agent } from './types';

export const AGENT_ROSTER: Agent[] = [
  {
    id: 'jarvis',
    name: 'Jarvis',
    role: 'Squad Lead',
    emoji: '🎯',
    cronJobId: '64647616-1fab-40a7-b35a-a50866fbeafd',
    status: 'idle',
  },
  {
    id: 'shuri',
    name: 'Shuri',
    role: 'Product Analyst',
    emoji: '📊',
    cronJobId: '012618a6-6196-4493-9a1f-80eaf0573652',
    status: 'idle',
  },
  {
    id: 'friday',
    name: 'Friday',
    role: 'Developer',
    emoji: '⚙️',
    cronJobId: '451b4d6f-ff2f-4000-ab3e-831e54e0d195',
    status: 'idle',
  },
  {
    id: 'loki',
    name: 'Loki',
    role: 'Content Writer',
    emoji: '✍️',
    cronJobId: 'af7c0b7c-0d62-48c1-9ba0-09943e537540',
    status: 'idle',
  },
  {
    id: 'wanda',
    name: 'Wanda',
    role: 'Designer',
    emoji: '🎨',
    cronJobId: '8c1eadf6-cecf-4fea-8772-d8504e9f1d35',
    status: 'idle',
  },
  {
    id: 'vision',
    name: 'Vision',
    role: 'SEO Analyst',
    emoji: '🔍',
    cronJobId: 'a010dd8f-1348-4409-95b4-954f29c6578c',
    status: 'idle',
  },
  {
    id: 'fury',
    name: 'Fury',
    role: 'Researcher',
    emoji: '🕵️',
    cronJobId: '0be0e054-27be-4f17-a10f-8fff8e51f88b',
    status: 'idle',
  },
  {
    id: 'quill',
    name: 'Quill',
    role: 'Social Media',
    emoji: '📢',
    cronJobId: '669cc5f5-ce1b-4329-a50f-a30fca9b9319',
    status: 'idle',
  },
  {
    id: 'pepper',
    name: 'Pepper',
    role: 'Email Marketing',
    emoji: '📧',
    cronJobId: 'e6d44c0e-862b-4572-a6a3-69fbf4ae3ed3',
    status: 'idle',
  },
  {
    id: 'wong',
    name: 'Wong',
    role: 'Documentation',
    emoji: '📚',
    cronJobId: 'b5ac7691-b7b6-4c94-a016-55aadbd610a4',
    status: 'idle',
  },
];

export const KNOWN_AGENTS = AGENT_ROSTER.map(a => a.name);

export const KEYWORD_AGENT_MAP: Record<string, string> = {
  squad: 'Jarvis',
  design: 'Wanda',
  email: 'Pepper',
  documentation: 'Wong',
  docs: 'Wong',
  research: 'Fury',
  social: 'Quill',
  content: 'Quill',
};

export function findAgentByName(name: string): Agent | undefined {
  return AGENT_ROSTER.find(a => a.name.toLowerCase() === name.toLowerCase());
}

export function findAgentByCronJobId(jobId: string): Agent | undefined {
  return AGENT_ROSTER.find(a => a.cronJobId === jobId);
}

export function identifyAgent(text: string): string {
  const lower = text.toLowerCase();
  for (const name of KNOWN_AGENTS) {
    if (lower.includes(name.toLowerCase())) return name;
  }
  for (const [keyword, agent] of Object.entries(KEYWORD_AGENT_MAP)) {
    if (lower.includes(keyword)) return agent;
  }
  return '[cron]';
}
