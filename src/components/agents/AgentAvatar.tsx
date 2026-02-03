import { cn } from '@/lib/utils';
import type { AgentStatus } from '@/lib/types';

interface AgentAvatarProps {
  emoji: string;
  status: AgentStatus;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-lg',
  lg: 'w-16 h-16 text-2xl',
};

const statusRing = {
  idle: 'ring-border',
  working: 'ring-accent',
  offline: 'ring-error/40',
};

export function AgentAvatar({ emoji, status, size = 'md' }: AgentAvatarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl glass ring-1',
        sizeClasses[size],
        statusRing[status],
        status === 'working' && 'animate-breathe glow-gold'
      )}
    >
      {emoji}
    </div>
  );
}
