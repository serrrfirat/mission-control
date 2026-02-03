'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Activity, MessageSquare, Clock, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Squad', icon: Users },
  { href: '/monitor', label: 'Monitor', icon: Activity },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/schedule', label: 'Schedule', icon: Clock },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass safe-bottom">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full h-full press-scale transition-colors duration-300',
                active ? 'text-accent-light' : 'text-muted'
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2 : 1.5} />
              <span className="label-upper" style={{ fontSize: '8px' }}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
