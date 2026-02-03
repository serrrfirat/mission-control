'use client';

import { cn } from '@/lib/utils';

interface ScheduleToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export function ScheduleToggle({ enabled, onChange, disabled }: ScheduleToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      disabled={disabled}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors duration-300 press-scale',
        enabled ? 'bg-accent/40 border border-accent/50' : 'bg-surface border border-border'
      )}
    >
      <div
        className={cn(
          'absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300',
          enabled ? 'left-5 bg-accent-light' : 'left-0.5 bg-muted'
        )}
      />
    </button>
  );
}
