'use client';

import { useCronJobs } from '@/lib/hooks/useCronJobs';
import { useStore } from '@/lib/store';
import { CronJobCard } from '@/components/schedule/CronJobCard';
import { Clock } from 'lucide-react';
import { Skeleton } from '@/components/shared/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';

export default function SchedulePage() {
  const cronJobs = useStore((s) => s.cronJobs);
  const { refetch } = useCronJobs(30000);

  if (cronJobs.length === 0) {
    return (
      <div>
        <div className="px-5 pt-5 pb-2">
          <h2 className="text-xl font-bold italic font-[family-name:var(--font-display)] text-accent-light">Schedule</h2>
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const agentJobs = cronJobs.filter((j) => j.name.endsWith('-heartbeat'));
  const otherJobs = cronJobs.filter((j) => !j.name.endsWith('-heartbeat'));

  return (
    <div>
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold italic font-[family-name:var(--font-display)] text-accent-light">Schedule</h2>
        <span className="label-upper text-muted">
          {cronJobs.filter((j) => j.enabled).length}/{cronJobs.length} active
        </span>
      </div>

      {agentJobs.length > 0 && (
        <div className="px-4 space-y-3 mb-5">
          <h3 className="label-upper text-accent/60 px-1">Agent Heartbeats</h3>
          {agentJobs.map((job) => (
            <CronJobCard key={job.id} job={job} onUpdate={refetch} />
          ))}
        </div>
      )}

      {otherJobs.length > 0 && (
        <div className="px-4 space-y-3 mb-5">
          <h3 className="label-upper text-accent/60 px-1">Other Jobs</h3>
          {otherJobs.map((job) => (
            <CronJobCard key={job.id} job={job} onUpdate={refetch} />
          ))}
        </div>
      )}

      {cronJobs.length === 0 && (
        <EmptyState
          icon={Clock}
          title="No cron jobs"
          description="Cron jobs will appear here once configured in OpenClaw"
        />
      )}
    </div>
  );
}
