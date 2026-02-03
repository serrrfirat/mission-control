'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FeedItem, Agent, CronJob } from './types';
import { AGENT_ROSTER } from './agents';

interface AgentOverrides {
  [agentId: string]: { name?: string; role?: string; emoji?: string };
}

interface AppState {
  // Gateway connection
  gatewayOnline: boolean;
  setGatewayOnline: (online: boolean) => void;

  // Agents
  agents: Agent[];
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  setAgents: (agents: Agent[]) => void;

  // Agent identity overrides (persisted)
  agentOverrides: AgentOverrides;
  updateAgentOverride: (id: string, overrides: { name?: string; role?: string; emoji?: string }) => void;

  // Feed (gateway events — Convex activities are merged at component level)
  feedItems: FeedItem[];
  addFeedItem: (item: FeedItem) => void;
  setFeedItems: (items: FeedItem[]) => void;

  // Cron jobs
  cronJobs: CronJob[];
  setCronJobs: (jobs: CronJob[]) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      gatewayOnline: false,
      setGatewayOnline: (online) => set({ gatewayOnline: online }),

      agents: AGENT_ROSTER,
      updateAgent: (id, updates) =>
        set((s) => ({
          agents: s.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),
      setAgents: (agents) => set({ agents }),

      agentOverrides: {},
      updateAgentOverride: (id, overrides) =>
        set((s) => {
          const newOverrides = {
            ...s.agentOverrides,
            [id]: { ...s.agentOverrides[id], ...overrides },
          };
          const agents = s.agents.map((a) =>
            a.id === id ? { ...a, ...overrides } : a
          );
          return { agentOverrides: newOverrides, agents };
        }),

      feedItems: [],
      addFeedItem: (item) =>
        set((s) => ({
          feedItems: [...s.feedItems, item].slice(-500),
        })),
      setFeedItems: (items) => set({ feedItems: items }),

      cronJobs: [],
      setCronJobs: (jobs) => set({ cronJobs: jobs }),
    }),
    {
      name: 'claw-control-storage',
      partialize: (state) => ({
        agentOverrides: state.agentOverrides,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState> | undefined;
        if (!p) return current;
        const overrides = p.agentOverrides || {};
        const agents = current.agents.map((a) =>
          overrides[a.id] ? { ...a, ...overrides[a.id] } : a
        );
        return { ...current, ...p, agents };
      },
    }
  )
);
