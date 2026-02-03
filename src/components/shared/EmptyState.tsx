import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <Icon className="w-10 h-10 text-accent/30 mb-4" strokeWidth={1} />
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {description && (
        <p className="text-xs text-muted font-light mt-1.5 max-w-[260px]">{description}</p>
      )}
    </div>
  );
}
