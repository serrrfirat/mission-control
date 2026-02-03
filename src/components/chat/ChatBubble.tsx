import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex mb-3', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed',
          isUser
            ? 'bg-accent/20 border border-accent/30 text-foreground rounded-br-md'
            : 'glass rounded-bl-md'
        )}
      >
        <p className="whitespace-pre-wrap break-words font-light">{content}</p>
        {timestamp && (
          <p className="text-[9px] font-mono text-muted mt-1.5 text-right">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </div>
  );
}
