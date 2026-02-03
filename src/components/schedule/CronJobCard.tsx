'use client';

import { useState } from 'react';
import { Clock, Timer } from 'lucide-react';
import { ScheduleToggle } from './ScheduleToggle';
import { RunButton } from './RunButton';
import { IntervalPicker } from './IntervalPicker';
import { findAgentByCronJobId } from '@/lib/agents';
import { formatRelativeTime, formatInterval, formatDuration } from '@/lib/utils';
import { toggleCronJob, updateCronInterval, runCronJob } from '@/lib/hooks/useCronJobs';
import { useToast } from '@/components/shared/Toast';
import type { CronJob } from '@/lib/types';

interface CronJobCardProps {
  job: CronJob;
  onUpdate: () => void;
}

export function CronJobCard({ job, onUpdate }: CronJobCardProps) {
  const [showPicker, setShowPicker] = useState(false);
  const { toast } = useToast();
  const agent = findAgentByCronJobId(job.id);

  const handleToggle = async (enabled: boolean) => {
    const ok = await toggleCronJob(job.id, enabled);
    if (ok) {
      toast(`${job.name} ${enabled ? 'enabled' : 'disabled'}`, 'success');
      onUpdate();
    } else {
      toast('Failed to update job', 'error');
    }
  };

  const handleInterval = async (ms: number) => {
    const ok = await updateCronInterval(job.id, ms);
    if (ok) {
      toast(`Interval updated to ${formatInterval(ms)}`, 'success');
      onUpdate();
    } else {
      toast('Failed to update interval', 'error');
    }
  };

  const handleRun = async () => {
    const ok = await runCronJob(job.id);
    if (ok) {
      toast(`${job.name} triggered`, 'success');
      onUpdate();
    } else {
      toast('Failed to run job', 'error');
    }
    return ok;
  };

  const intervalStr = job.schedule.kind === 'every' && job.schedule.everyMs
    ? formatInterval(job.schedule.everyMs)
    : job.schedule.expr || '—';

  return (
    <>
      <div className="glass rounded-2xl p-4 space-y-3 card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {agent && <span className="text-lg">{agent.emoji}</span>}
            <div>
              <h3 className="text-sm font-semibold">{agent?.name || job.name}</h3>
              <p className="text-[10px] text-muted font-mono">{job.name}</p>
            </div>
          </div>
          <ScheduleToggle enabled={job.enabled} onChange={handleToggle} />
        </div>

        <div className="flex items-center gap-3 text-xs text-muted">
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-1 press-scale hover:text-accent-light transition-colors duration-300"
          >
            <Timer className="w-3 h-3" />
            <span className="font-mono">{intervalStr}</span>
          </button>

          {job.state.lastRunAtMs && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="font-mono">{formatRelativeTime(job.state.lastRunAtMs)}</span>
            </div>
          )}

          {job.state.lastDurationMs && (
            <span className="font-mono text-[10px]">
              {formatDuration(job.state.lastDurationMs)}
            </span>
          )}

          {job.state.lastStatus && (
            <span
              className={`label-upper ${
                job.state.lastStatus === 'ok' ? 'text-success' : 'text-error'
              }`}
            >
              {job.state.lastStatus.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex justify-end">
          <RunButton onRun={handleRun} />
        </div>
      </div>

      {showPicker && (
        <IntervalPicker
          currentMs={job.schedule.everyMs || 900000}
          onSelect={handleInterval}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
