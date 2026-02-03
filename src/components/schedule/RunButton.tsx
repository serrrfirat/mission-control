'use client';

import { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';

interface RunButtonProps {
  onRun: () => Promise<boolean>;
}

export function RunButton({ onRun }: RunButtonProps) {
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    await onRun();
    setRunning(false);
  };

  return (
    <button
      onClick={handleRun}
      disabled={running}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-medium press-scale disabled:opacity-40 hover:bg-accent/20 hover:border-accent/30 transition-all duration-300"
    >
      {running ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Play className="w-3 h-3" />
      )}
      {running ? 'Running' : 'Run Now'}
    </button>
  );
}
