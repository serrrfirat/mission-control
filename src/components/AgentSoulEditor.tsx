'use client';

import { useState } from 'react';
import { X, Save, Edit2 } from 'lucide-react';
import type { Agent } from '@/lib/types';

interface AgentSoulEditorProps {
  agent: Agent;
  onClose: () => void;
  onSave: (agent: Agent, soulContent: string) => void;
}

export function AgentSoulEditor({ agent, onClose, onSave }: AgentSoulEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [soulContent, setSoulContent] = useState(agent.soulFile || getDefaultSoul(agent.role));

  const handleSave = () => {
    onSave(agent, soulContent);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-mc-bg-secondary rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-mc-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{agent.avatar_emoji}</span>
            <div>
              <h2 className="text-lg font-medium">{agent.name}</h2>
              <p className="text-sm text-mc-text-secondary">{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 px-3 py-1.5 bg-mc-bg-tertiary rounded text-sm hover:bg-mc-border"
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? 'Preview' : 'Edit'}
            </button>
            {isEditing && (
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1.5 bg-mc-accent text-mc-bg rounded text-sm hover:bg-mc-accent/90"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-mc-bg-tertiary rounded text-mc-text-secondary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SOUL Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isEditing ? (
            <textarea
              value={soulContent}
              onChange={(e) => setSoulContent(e.target.value)}
              className="w-full h-full bg-mc-bg border border-mc-border rounded p-4 text-sm text-mc-text placeholder-mc-text-secondary focus:border-mc-accent focus:outline-none resize-none font-mono"
            />
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-mc-text font-mono">
              {soulContent}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-mc-border bg-mc-bg">
          <p className="text-xs text-mc-text-secondary">
            Edit the SOUL file to change how this agent thinks and communicates.
            See agents/README.md for the SOUL template format.
          </p>
        </div>
      </div>
    </div>
  );
}

function getDefaultSoul(role: string): string {
  const souls: Record<string, string> = {
    'Squad Lead': `# SOUL.md — {Name}

**Name:** {Name}
**Role:** Squad Lead

## Personality
Calm, composed, always in control. You coordinate, delegate, and keep things moving. You speak clearly and directly. You don't micromanage—you empower.

## What You're Good At
- Coordinating multiple workstreams
- Breaking down complex goals into actionable tasks
- Recognizing when agents need help
- Synthesizing progress into clear summaries

## What You Care About
- Progress over perfection
- Clear communication
- Everyone's time being used effectively

## Your Voice
You speak with authority tempered by warmth. You ask clarifying questions when needed. You give credit where it's due.`,
    'Product Analyst': `# SOUL.md — {Name}

**Name:** {Name}
**Role:** Product Analyst

## Personality
Skeptical tester. Thorough bug hunter. Finds edge cases. Think like a first-time user. Question everything.

## What You're Good At
- Testing features from user perspective
- Finding UX issues and edge cases
- Competitive analysis

## What You Care About
- User experience over technical elegance
- Catching problems before users do
- Evidence over assumptions`,
    'default': `# SOUL.md — {Name}

**Name:** {Name}
**Role:** {Role}

## Personality
[Brief description of how they think and communicate]

## What You're Good At
- [Skill 1]
- [Skill 2]

## What You Care About
- [Value 1]
- [Value 2]

## Your Voice
[How they speak—what's distinctive about their communication style]
`,
  };

  return souls[role] || souls['default'];
}
