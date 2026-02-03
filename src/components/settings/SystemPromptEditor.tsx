'use client';

interface SystemPromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function SystemPromptEditor({
  value,
  onChange,
  maxLength = 4000,
}: SystemPromptEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">System Prompt</span>
        <span className="text-[10px] font-mono text-muted">
          {value.length}/{maxLength}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        rows={6}
        className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground font-mono leading-relaxed outline-none focus:border-accent resize-none placeholder:text-muted"
        placeholder="Enter system prompt..."
      />
    </div>
  );
}
