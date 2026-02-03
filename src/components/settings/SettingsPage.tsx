'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAgent } from '@/lib/hooks/useAgents';
import { useAgentSettings } from '@/lib/hooks/useAgentSettings';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/shared/Toast';
import { AgentAvatar } from '@/components/agents/AgentAvatar';
import { SettingsSection } from './SettingsSection';
import { InlineEditField } from './InlineEditField';
import { ModelSelect } from './ModelSelect';
import { TemperatureSlider } from './TemperatureSlider';
import { SystemPromptEditor } from './SystemPromptEditor';
import { ScheduleToggle } from '@/components/schedule/ScheduleToggle';
import { formatInterval } from '@/lib/utils';

const INTERVAL_PRESETS = [
  { label: '5m', ms: 300000 },
  { label: '15m', ms: 900000 },
  { label: '30m', ms: 1800000 },
  { label: '1h', ms: 3600000 },
  { label: '2h', ms: 7200000 },
  { label: '6h', ms: 21600000 },
];

interface SettingsPageProps {
  agentId: string;
}

export function SettingsPage({ agentId }: SettingsPageProps) {
  const agent = useAgent(agentId);
  const { settings, loading, saving, save, error } = useAgentSettings(agentId);
  const updateAgentOverride = useStore((s) => s.updateAgentOverride);
  const { toast } = useToast();

  // Form state for server-side fields
  const [formHeartbeatMs, setFormHeartbeatMs] = useState<number>(900000);
  const [formPrompt, setFormPrompt] = useState('');
  const [formTemperature, setFormTemperature] = useState(0.7);
  const [formModel, setFormModel] = useState('');
  const [dirty, setDirty] = useState(false);

  // Sync form state when settings load
  useEffect(() => {
    if (settings) {
      setFormHeartbeatMs(settings.heartbeatMs ?? 900000);
      setFormPrompt(settings.systemPrompt ?? '');
      setFormTemperature(settings.temperature ?? 0.7);
      setFormModel(settings.model ?? '');
      setDirty(false);
    }
  }, [settings]);

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-64 text-muted text-sm">
        Agent not found
      </div>
    );
  }

  function markDirty() {
    setDirty(true);
  }

  async function handleSave() {
    const updates: Record<string, unknown> = {};
    if (formHeartbeatMs !== (settings?.heartbeatMs ?? 900000)) {
      updates.heartbeatMs = formHeartbeatMs;
    }
    if (formPrompt !== (settings?.systemPrompt ?? '')) {
      updates.systemPrompt = formPrompt;
    }
    if (formModel !== (settings?.model ?? '')) {
      updates.model = formModel;
    }

    if (Object.keys(updates).length === 0) {
      setDirty(false);
      return;
    }

    const ok = await save(updates);
    if (ok) {
      toast('Settings saved', 'success');
      setDirty(false);
    } else {
      toast('Failed to save settings', 'error');
    }
  }

  async function handleToggleEnabled(enabled: boolean) {
    const ok = await save({ enabled });
    if (ok) {
      toast(enabled ? 'Agent enabled' : 'Agent disabled', 'success');
    } else {
      toast('Failed to update', 'error');
    }
  }

  function handleIdentitySave(field: 'name' | 'role' | 'emoji', value: string) {
    updateAgentOverride(agentId, { [field]: value });
    toast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated`, 'success');
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-7.5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 glass">
        <div className="flex items-center gap-3.5">
          <Link href={`/chat/${agentId}`} className="press-scale">
            <ArrowLeft className="w-5 h-5 text-muted" />
          </Link>
          <AgentAvatar emoji={agent.emoji} status={agent.status} size="sm" />
          <div>
            <h3 className="text-sm font-semibold">{agent.name}</h3>
            <p className="label-upper text-muted">Settings</p>
          </div>
        </div>
        {dirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent/20 text-accent text-sm font-medium press-scale disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-4 h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {error && (
              <div className="glass rounded-2xl p-4 border-error/30 border">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {/* Identity Section */}
            <SettingsSection title="Identity">
              <InlineEditField
                label="Name"
                value={agent.name}
                onSave={(v) => handleIdentitySave('name', v)}
              />
              <InlineEditField
                label="Role"
                value={agent.role}
                onSave={(v) => handleIdentitySave('role', v)}
              />
              <InlineEditField
                label="Emoji"
                value={agent.emoji}
                onSave={(v) => handleIdentitySave('emoji', v)}
                maxLength={4}
              />
            </SettingsSection>

            {/* Status Section */}
            <SettingsSection title="Status">
              <div className="flex items-center justify-between min-h-[44px]">
                <span className="text-sm text-muted-foreground">Enabled</span>
                <ScheduleToggle
                  enabled={settings?.enabled ?? true}
                  onChange={handleToggleEnabled}
                />
              </div>
            </SettingsSection>

            {/* Heartbeat Section */}
            <SettingsSection title="Heartbeat">
              <div className="space-y-2">
                <div className="flex items-center justify-between min-h-[44px]">
                  <span className="text-sm text-muted-foreground">Interval</span>
                  <span className="text-sm font-mono text-foreground">
                    {formatInterval(formHeartbeatMs)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {INTERVAL_PRESETS.map((p) => (
                    <button
                      key={p.ms}
                      onClick={() => {
                        setFormHeartbeatMs(p.ms);
                        markDirty();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm press-scale transition-colors ${
                        formHeartbeatMs === p.ms
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'bg-surface text-muted-foreground border border-border-subtle hover:bg-surface-hover'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </SettingsSection>

            {/* Model Section */}
            <SettingsSection title="Model">
              <ModelSelect
                value={formModel}
                onChange={(v) => {
                  setFormModel(v);
                  markDirty();
                }}
              />
              <TemperatureSlider
                value={formTemperature}
                onChange={(v) => {
                  setFormTemperature(v);
                  markDirty();
                }}
              />
            </SettingsSection>

            {/* System Prompt Section */}
            <SettingsSection title="System Prompt">
              <SystemPromptEditor
                value={formPrompt}
                onChange={(v) => {
                  setFormPrompt(v);
                  markDirty();
                }}
              />
            </SettingsSection>
          </>
        )}
      </div>
    </div>
  );
}
