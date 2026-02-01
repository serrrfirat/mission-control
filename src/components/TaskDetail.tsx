'use client';

import { useState, useEffect } from 'react';
import { X, MessageSquare, FileText, Clock, User, Send } from 'lucide-react';
import { useMissionControl } from '@/lib/store';
import type { Task, Agent } from '@/lib/types';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetail({ task, onClose }: TaskDetailProps) {
  const { agents, addEvent } = useMissionControl();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; agentId: string; content: string; createdAt: number }>>([]);
  const [showCommentInput, setShowCommentInput] = useState(false);

  // Load comments for this task (would use Convex in production)
  useEffect(() => {
    // Placeholder: load comments from API
    setComments([
      {
        id: '1',
        agentId: 'agent:main:main',
        content: 'Started working on this task. Initial research complete.',
        createdAt: Date.now() - 3600000,
      },
    ]);
  }, [task.id]);

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    // In production, this would call Convex mutation
    const newComment = {
      id: crypto.randomUUID(),
      agentId: 'agent:main:main', // Current agent
      content: comment,
      createdAt: Date.now(),
    };
    
    setComments([...comments, newComment]);
    setComment('');
    setShowCommentInput(false);
    
    // Add activity
    addEvent({
      id: crypto.randomUUID(),
      type: 'message_sent',
      task_id: task.id,
      message: `Comment added to "${task.title}"`,
      created_at: new Date().toISOString(),
    });
  };

  const assignees = task.assigneeIds?.map(id => agents.find(a => a.id === id)).filter(Boolean) as Agent[] || [];
  const creator = agents.find(a => a.id === task.creatorId);

  const statusColors: Record<string, string> = {
    inbox: 'bg-gray-500',
    assigned: 'bg-blue-500',
    in_progress: 'bg-yellow-500',
    review: 'bg-purple-500',
    done: 'bg-green-500',
    blocked: 'bg-red-500',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-mc-bg-secondary rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-mc-border flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded uppercase ${statusColors[task.status]} text-white`}>
                {task.status.replace('_', ' ')}
              </span>
              {task.priority && (
                <span className="text-xs px-2 py-0.5 rounded bg-mc-bg-tertiary text-mc-text-secondary uppercase">
                  {task.priority}
                </span>
              )}
            </div>
            <h2 className="text-lg font-medium">{task.title}</h2>
            {creator && (
              <p className="text-sm text-mc-text-secondary mt-1">
                Created by {creator.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-mc-bg-tertiary rounded text-mc-text-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Description */}
          {task.description && (
            <div className="prose prose-sm max-w-none">
              <p className="text-mc-text">{task.description}</p>
            </div>
          )}

          {/* Assignees */}
          {assignees.length > 0 && (
            <div>
              <h3 className="text-xs font-medium uppercase text-mc-text-secondary mb-2">
                Assigned To
              </h3>
              <div className="flex flex-wrap gap-2">
                {assignees.map(agent => (
                  <div
                    key={agent.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-mc-bg-tertiary rounded-full"
                  >
                    <span>{agent.avatar_emoji}</span>
                    <span className="text-sm">{agent.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium uppercase text-mc-text-secondary">
                Comments ({comments.length})
              </h3>
              <button
                onClick={() => setShowCommentInput(true)}
                className="flex items-center gap-1 text-xs text-mc-accent hover:text-mc-accent/80"
              >
                <MessageSquare className="w-3 h-3" />
                Add Comment
              </button>
            </div>

            {/* Comment Input */}
            {showCommentInput && (
              <div className="mb-3">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full bg-mc-bg border border-mc-border rounded p-3 text-sm text-mc-text placeholder-mc-text-secondary focus:border-mc-accent focus:outline-none"
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setShowCommentInput(false)}
                    className="px-3 py-1 text-xs text-mc-text-secondary hover:text-mc-text"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddComment}
                    className="px-3 py-1 text-xs bg-mc-accent text-mc-bg rounded hover:bg-mc-accent/90"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map(comment => {
                const agent = agents.find(a => a.id === comment.agentId);
                return (
                  <div key={comment.id} className="bg-mc-bg rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {agent && (
                        <>
                          <span>{agent.avatar_emoji}</span>
                          <span className="text-sm font-medium">{agent.name}</span>
                        </>
                      )}
                      <span className="text-xs text-mc-text-secondary">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-mc-text">{comment.content}</p>
                  </div>
                );
              })}
              {comments.length === 0 && (
                <p className="text-sm text-mc-text-secondary text-center py-4">
                  No comments yet. Be the first!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
