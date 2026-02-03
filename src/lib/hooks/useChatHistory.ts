'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage } from '../types';

export function useChatHistory(sessionKey: string | null, pollMs = 3000) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!sessionKey) return;
    try {
      const encoded = encodeURIComponent(sessionKey);
      const res = await fetch(`/api/chat/${encoded}`);
      if (!res.ok) {
        setError('Failed to load chat history');
        return;
      }
      const data = await res.json();
      if (data.ok && Array.isArray(data.messages)) {
        setMessages(data.messages);
        setError(null);
      }
    } catch {
      setError('Connection error');
    }
  }, [sessionKey]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!sessionKey) return false;
      try {
        const encoded = encodeURIComponent(sessionKey);
        const res = await fetch(`/api/chat/${encoded}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });
        if (res.ok) {
          // Optimistic: add user message immediately
          setMessages((prev) => [
            ...prev,
            { role: 'user', content: message, timestamp: new Date().toISOString() },
          ]);
          // Refetch after a short delay to get assistant response
          setTimeout(fetchHistory, 1000);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [sessionKey, fetchHistory]
  );

  useEffect(() => {
    if (!sessionKey) return;
    setLoading(true);
    fetchHistory().then(() => setLoading(false));
    const id = setInterval(fetchHistory, pollMs);
    return () => clearInterval(id);
  }, [sessionKey, fetchHistory, pollMs]);

  return { messages, loading, error, sendMessage, refetch: fetchHistory };
}
