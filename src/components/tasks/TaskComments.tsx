'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { CommentBubble } from './CommentBubble';
import { useCreateMessage } from '@/lib/hooks/useTaskDetail';
import { useAgents } from '@/lib/hooks/useAgents';
import type { Id } from '../../../convex/_generated/dataModel';

interface TaskCommentsProps {
  taskId: Id<'tasks'>;
  messages: Array<{
    _id: string;
    fromAgentId: string;
    content: string;
    createdAt: number;
  }>;
}

export function TaskComments({ taskId, messages }: TaskCommentsProps) {
  const [content, setContent] = useState('');
  const [fromAgent, setFromAgent] = useState('');
  const createMessage = useCreateMessage();
  const agents = useAgents();

  const handleSubmit = async () => {
    if (!content.trim() || !fromAgent) return;
    await createMessage({
      taskId,
      fromAgentId: fromAgent,
      content: content.trim(),
    });
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="label-upper text-muted-foreground">
        Comments <span className="text-muted">{messages.length}</span>
      </h4>

      {messages.length === 0 && (
        <p className="text-xs text-muted font-light">No comments yet</p>
      )}

      <div className="space-y-4">
        {messages.map((msg) => (
          <CommentBubble
            key={msg._id}
            fromAgentId={msg.fromAgentId}
            content={msg.content}
            createdAt={msg.createdAt}
          />
        ))}
      </div>

      <div className="glass rounded-2xl p-3 space-y-2">
        <select
          value={fromAgent}
          onChange={(e) => setFromAgent(e.target.value)}
          className="w-full bg-surface rounded-xl px-3 py-2 text-xs font-light outline-none border border-border-subtle focus:border-accent/40 text-muted-foreground"
        >
          <option value="">Comment as...</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.emoji} {a.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment... use @name to mention"
            rows={2}
            className="flex-1 bg-surface rounded-xl px-3 py-2 text-xs font-light outline-none border border-border-subtle focus:border-accent/40 placeholder:text-muted resize-none transition-colors duration-300"
          />
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || !fromAgent}
            className="self-end w-9 h-9 flex items-center justify-center rounded-xl bg-accent/20 border border-accent/30 text-accent-light press-scale disabled:opacity-30"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
