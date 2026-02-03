'use client';

import { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';

interface InlineEditFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  maxLength?: number;
}

export function InlineEditField({ label, value, onSave, maxLength = 50 }: InlineEditFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function handleBlur() {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    } else {
      setDraft(value);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      setDraft(value);
      setEditing(false);
    }
  }

  return (
    <div className="flex items-center justify-between min-h-[44px]">
      <span className="text-sm text-muted-foreground">{label}</span>
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, maxLength))}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:border-accent w-40 text-right"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 text-sm text-foreground press-scale"
        >
          <span>{value}</span>
          <Pencil className="w-3.5 h-3.5 text-muted" />
        </button>
      )}
    </div>
  );
}
