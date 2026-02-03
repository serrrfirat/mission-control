'use client';

import { use } from 'react';
import { useAgent, useAgentSessionKey } from '@/lib/hooks/useAgents';
import { useChatHistory } from '@/lib/hooks/useChatHistory';
import { ChatThread } from '@/components/chat/ChatThread';
import { ChatInput } from '@/components/chat/ChatInput';
import { AgentAvatar } from '@/components/agents/AgentAvatar';
import { ArrowLeft, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AgentChatPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = use(params);
  const agent = useAgent(agentId);
  const sessionKey = useAgentSessionKey(agentId);
  const { messages, loading, sendMessage } = useChatHistory(sessionKey || null);

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-64 text-muted text-sm font-light">
        Agent not found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-7.5rem)]">
      <div className="flex items-center justify-between px-5 py-3 glass">
        <div className="flex items-center gap-3.5">
          <Link href="/chat" className="press-scale">
            <ArrowLeft className="w-5 h-5 text-muted" />
          </Link>
          <AgentAvatar emoji={agent.emoji} status={agent.status} size="sm" />
          <div>
            <h3 className="text-sm font-semibold">{agent.name}</h3>
            <p className="label-upper text-muted">{agent.role}</p>
          </div>
        </div>
        <Link href={`/chat/${agentId}/settings`} className="press-scale p-2">
          <Settings className="w-5 h-5 text-muted" />
        </Link>
      </div>

      <ChatThread messages={messages} loading={loading} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
