'use client';

import { useEffect, useCallback } from 'react';
import { useStore } from '../store';
import type { CronJob } from '../types';

export function useCronJobs(intervalMs = 30000) {
  const { setCronJobs } = useStore();

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/cron');
      if (!res.ok) return;
      const data = await res.json();
      if (data.ok && Array.isArray(data.jobs)) {
        setCronJobs(data.jobs as CronJob[]);
      }
    } catch {
      // silent
    }
  }, [setCronJobs]);

  useEffect(() => {
    fetchJobs();
    const id = setInterval(fetchJobs, intervalMs);
    return () => clearInterval(id);
  }, [fetchJobs, intervalMs]);

  return { refetch: fetchJobs };
}

export async function toggleCronJob(id: string, enabled: boolean): Promise<boolean> {
  try {
    const res = await fetch(`/api/cron/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateCronInterval(id: string, everyMs: number): Promise<boolean> {
  try {
    const res = await fetch(`/api/cron/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule: { kind: 'every', everyMs } }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function runCronJob(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/cron/${id}/run`, { method: 'POST' });
    return res.ok;
  } catch {
    return false;
  }
}
