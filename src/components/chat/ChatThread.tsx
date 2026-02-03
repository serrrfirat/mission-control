'use client';

import { useEffect, useRef } from 'react';
import { ChatBubble } from './ChatBubble';
import type { ChatMessage } from '@/lib/types';
import { EmptyState } from '@/components/shared/EmptyState';
import { MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/shared/Skeleton';

interface ChatThreadProps {
  messages: ChatMessage[];
  loading?: boolean;
}

export function ChatThread({ messages, loading }: ChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-1/2 ml-auto" />
        <Skeleton className="h-16 w-3/4" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No messages yet"
        description="Send a message to start a conversation with this agent"
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, i) => (
        <ChatBubble
          key={i}
          role={msg.role}
          content={msg.content}
          timestamp={msg.timestamp}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}
