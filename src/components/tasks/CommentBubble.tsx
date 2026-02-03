import { useAgents } from '@/lib/hooks/useAgents';
import { formatRelativeTime } from '@/lib/utils';

interface CommentBubbleProps {
  fromAgentId: string;
  content: string;
  createdAt: number;
}

export function CommentBubble({ fromAgentId, content, createdAt }: CommentBubbleProps) {
  const agents = useAgents();
  const agent = agents.find((a) => a.id === fromAgentId);

  // Highlight @mentions
  const rendered = content.replace(
    /@(\w+)/g,
    '<span class="text-accent-light font-semibold">@$1</span>'
  );

  return (
    <div className="flex gap-3 animate-slide-in">
      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-sm shrink-0 border border-border-subtle">
        {agent?.emoji ?? '?'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-xs font-semibold text-accent-light">
            {agent?.name ?? fromAgentId}
          </span>
          <span className="text-[10px] font-mono text-muted">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        <p
          className="text-xs text-muted-foreground leading-relaxed font-light"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      </div>
    </div>
  );
}
