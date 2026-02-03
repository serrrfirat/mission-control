'use client';

import { useStore } from '@/lib/store';

export function StatusPill() {
  const online = useStore((s) => s.gatewayOnline);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full">
      <div
        className={`w-2 h-2 rounded-full ${
          online ? 'bg-success animate-live' : 'bg-error'
        }`}
      />
      <span className={`label-upper ${online ? 'text-success' : 'text-error'}`}>
        {online ? 'LIVE' : 'OFFLINE'}
      </span>
    </div>
  );
}
