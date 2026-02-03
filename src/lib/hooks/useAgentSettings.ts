'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AgentSettings } from '../types';

interface UseAgentSettingsReturn {
  settings: AgentSettings | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  save: (updates: Partial<AgentSettings>) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useAgentSettings(agentId: string | undefined): UseAgentSettingsReturn {
  const [settings, setSettings] = useState<AgentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!agentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/agent/${agentId}/settings`);
      const data = await res.json();
      if (data.ok) {
        setSettings(data.settings);
      } else {
        setError(data.error || 'Failed to load settings');
      }
    } catch {
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const save = useCallback(
    async (updates: Partial<AgentSettings>): Promise<boolean> => {
      if (!agentId) return false;
      setSaving(true);
      // Optimistic update
      const prev = settings;
      setSettings((s) => (s ? { ...s, ...updates } : null));
      try {
        const res = await fetch(`/api/agent/${agentId}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (!data.ok) {
          // Rollback
          setSettings(prev);
          setError(data.error || 'Save failed');
          return false;
        }
        return true;
      } catch {
        setSettings(prev);
        setError('Save failed');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [agentId, settings]
  );

  return { settings, loading, error, saving, save, refetch: fetchSettings };
}
