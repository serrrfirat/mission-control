'use client';

import { use } from 'react';
import { SettingsPage } from '@/components/settings/SettingsPage';

export default function AgentSettingsPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = use(params);
  return <SettingsPage agentId={agentId} />;
}
