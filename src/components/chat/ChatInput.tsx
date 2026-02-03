'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <div className="flex items-center gap-2.5 p-3.5 glass">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Send a message..."
        disabled={disabled}
        className="flex-1 bg-surface rounded-full px-4 py-2.5 text-sm font-light outline-none border border-border-subtle focus:border-accent/40 placeholder:text-muted transition-colors duration-300"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/20 text-accent-light border border-accent/30 disabled:opacity-20 press-scale hover:bg-accent/30 transition-colors duration-300"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
