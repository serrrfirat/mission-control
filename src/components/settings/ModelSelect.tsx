'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { LLM_MODELS } from '@/lib/types';
import type { LLMModel } from '@/lib/types';

interface ModelSelectProps {
  value: string;
  onChange: (modelId: string) => void;
}

const DEFAULT_OPTION: LLMModel = {
  id: '' as LLMModel['id'],
  name: 'Default',
  provider: 'Uses agent default from config',
};

export function ModelSelect({ value, onChange }: ModelSelectProps) {
  const [open, setOpen] = useState(false);
  const current = LLM_MODELS.find((m) => m.id === value);
  const displayName = current?.name ?? (value || 'Default');

  const options = [DEFAULT_OPTION, ...LLM_MODELS];

  return (
    <>
      <div className="flex items-center justify-between min-h-[44px]">
        <span className="text-sm text-muted-foreground">Model</span>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 text-sm text-foreground press-scale"
        >
          <span>{displayName}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md glass rounded-t-2xl animate-slide-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
              <h3 className="text-sm font-semibold">Select Model</h3>
              <button onClick={() => setOpen(false)} className="press-scale">
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>
            <div className="p-3 space-y-1 max-h-80 overflow-y-auto safe-bottom">
              {options.map((model) => {
                const isSelected = model.id === value;
                return (
                  <button
                    key={model.id || '__default'}
                    onClick={() => {
                      onChange(model.id);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left press-scale transition-colors ${
                      isSelected
                        ? 'bg-accent/15 border border-accent/30'
                        : 'hover:bg-surface-hover'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{model.name}</p>
                      <p className="text-xs text-muted">{model.provider}</p>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
