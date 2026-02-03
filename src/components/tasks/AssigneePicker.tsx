'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useAgents } from '@/lib/hooks/useAgents';

interface AssigneePickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function AssigneePicker({ selectedIds, onChange }: AssigneePickerProps) {
  const [open, setOpen] = useState(false);
  const agents = useAgents();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedAgents = agents.filter((a) => selectedIds.includes(a.id));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-surface rounded-xl px-4 py-2.5 text-xs font-light border border-border-subtle focus:border-accent/40 transition-colors duration-300"
      >
        <span className="text-muted-foreground">
          {selectedAgents.length === 0
            ? 'Assign agents (optional)'
            : selectedAgents.map((a) => `${a.emoji} ${a.name}`).join(', ')}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-muted shrink-0" />
      </button>

      {selectedAgents.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {selectedAgents.map((a) => (
            <span
              key={a.id}
              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent-light"
            >
              {a.emoji} {a.name}
              <button
                type="button"
                onClick={() => toggle(a.id)}
                className="hover:text-error"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 glass rounded-xl border border-border-subtle max-h-48 overflow-y-auto">
          {agents.map((agent) => {
            const selected = selectedIds.includes(agent.id);
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => toggle(agent.id)}
                className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-surface-hover transition-colors ${
                  selected ? 'text-accent-light' : 'text-muted-foreground'
                }`}
              >
                <span>{agent.emoji}</span>
                <span className="font-medium">{agent.name}</span>
                <span className="text-muted ml-auto">{agent.role}</span>
                {selected && (
                  <span className="text-accent-light text-[10px] font-bold">&#10003;</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
