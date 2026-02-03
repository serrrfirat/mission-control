'use client';

import { StatusPill } from './StatusPill';

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-3.5 glass">
      <h1 className="text-base font-bold italic font-[family-name:var(--font-display)] text-accent-light tracking-wide">
        Claw Control
      </h1>
      <StatusPill />
    </header>
  );
}
