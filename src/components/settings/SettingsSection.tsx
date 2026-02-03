'use client';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="label-upper text-muted mb-3">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
