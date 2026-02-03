'use client';

import { useState } from 'react';

const PRESETS = [
  { label: '5m', ms: 300000 },
  { label: '15m', ms: 900000 },
  { label: '30m', ms: 1800000 },
  { label: '1h', ms: 3600000 },
  { label: '2h', ms: 7200000 },
  { label: '6h', ms: 21600000 },
  { label: '12h', ms: 43200000 },
  { label: '24h', ms: 86400000 },
];

interface IntervalPickerProps {
  currentMs: number;
  onSelect: (ms: number) => void;
  onClose: () => void;
}

export function IntervalPicker({ currentMs, onSelect, onClose }: IntervalPickerProps) {
  const [selected, setSelected] = useState(currentMs);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md glass rounded-t-3xl p-5 safe-bottom" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        <h3 className="text-sm font-semibold mb-4">Set Interval</h3>
        <div className="grid grid-cols-4 gap-2.5">
          {PRESETS.map((p) => (
            <button
              key={p.ms}
              onClick={() => setSelected(p.ms)}
              className={`py-2.5 rounded-xl text-xs font-mono press-scale transition-all duration-300 border ${
                selected === p.ms
                  ? 'bg-accent/20 text-accent-light border-accent/40 glow-gold'
                  : 'bg-surface text-muted-foreground border-border-subtle'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full glass text-sm press-scale"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSelect(selected); onClose(); }}
            className="flex-1 py-3 rounded-full bg-accent/20 border border-accent/30 text-accent-light text-sm font-semibold press-scale"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
