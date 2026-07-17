'use client';

import { AlertCircle, Copy, Loader2, Send, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownPreview } from '@/features/mvp/components/Markdown';
import { analyzeLearning } from '@/features/learning-engine';
import { useWorkspaceStore } from '@/features/mvp/store';
import { useAIChat } from '../hooks/useAIChat';
import { buildAIContext, formatContextSystemMessage } from '../services/contextBuilder';
import { detectSkill, buildSkillSystemMessage, suggestedPrompts } from '../services/skillDetector';

/**
 * Athena Assistant: The context-aware study coach.
 * Detects study-related questions and provides expert guidance using learning engine data.
 */
export function AthenaAssistant() {
  const { settings, subjects, chapters, topics, tasks, sessions, flashcards, exams } =
    useWorkspaceStore();

  const chat = useAIChat(settings.openRouterApiKey);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages]);

  // Build learning intelligence and context
  const intelligence = analyzeLearning({
    subjects,
    chapters,
    topics,
    tasks,
    sessions,
    flashcards,
    exams,
    settings,
  });

  const context = buildAIContext(intelligence, subjects, settings);
  const genericSystemMessage = formatContextSystemMessage(context);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = messageInputRef.current?.value.trim();

    if (!text) {
      return;
    }

    if (messageInputRef.current) {
      messageInputRef.current.value = '';
    }

    // Detect if this is a skill-based question
    const skill = detectSkill(text);
    const skillSystemMessage = buildSkillSystemMessage(skill, intelligence, settings);
    const systemMessage = skillSystemMessage || genericSystemMessage;

    await chat.sendMessage(text, systemMessage);
  };

  const handleSuggestedPrompt = async (prompt: string) => {
    if (messageInputRef.current) {
      messageInputRef.current.value = '';
    }

    // Suggested prompts are always skills
    const skill = detectSkill(prompt);
    const skillSystemMessage = buildSkillSystemMessage(skill, intelligence, settings);
    const systemMessage = skillSystemMessage || genericSystemMessage;

    await chat.sendMessage(prompt, systemMessage);
  };

  const handleCopyMessage = (content: string) => {
    void navigator.clipboard.writeText(content);
  };

  if (!settings.openRouterApiKey) {
    return (
      <div className="flex h-[34rem] flex-col items-center justify-center gap-4 rounded-xl border border-yellow-400/20 bg-yellow-500/5 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-yellow-300" />
        <div>
          <p className="font-semibold text-yellow-100">API Key Required</p>
          <p className="mt-1 text-sm text-yellow-300">
            Add your OpenRouter API key in Settings to enable Athena Assistant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[34rem] flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pr-2">
        {chat.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="text-center">
              <p className="font-semibold text-zinc-200">Athena Assistant</p>
              <p className="mt-1 text-sm text-zinc-500">Your personalized study coach</p>
            </div>

            {/* Suggested prompts */}
            <div className="w-full space-y-2">
              <p className="text-xs font-medium text-zinc-600">Suggested Questions:</p>
              <div className="grid gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt.text}
                    type="button"
                    onClick={() => void handleSuggestedPrompt(prompt.text)}
                    className="rounded-lg border border-indigo-400/20 bg-indigo-500/5 px-3 py-2 text-left text-sm text-indigo-300 transition hover:bg-indigo-500/10"
                  >
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {chat.messages
          .filter((msg) => msg.role !== 'system')
          .map((message, index) => (
            <div
              key={index}
              className={`rounded-xl border p-3 ${
                message.role === 'user'
                  ? 'ml-8 border-indigo-400/20 bg-indigo-500/10'
                  : 'mr-8 border-white/10 bg-white/[0.03]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <MarkdownPreview content={message.content} />
                </div>
                {message.role === 'assistant' && (
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(message.content)}
                    className="mt-1 flex-shrink-0 rounded p-1 hover:bg-white/10"
                    aria-label="Copy response"
                    title="Copy response"
                  >
                    <Copy className="h-4 w-4 text-zinc-500" />
                  </button>
                )}
              </div>
            </div>
          ))}

        {/* Error message */}
        {chat.error && (
          <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3">
            <p className="text-sm text-red-300">{chat.error.message}</p>
            {chat.error.retryable && (
              <p className="mt-1 text-xs text-red-400">Try again in a moment.</p>
            )}
          </div>
        )}

        {/* Typing indicator */}
        {chat.isLoading && (
          <div className="mr-8 flex gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
            <span className="text-sm text-zinc-500">Athena is thinking...</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
        <Input
          ref={messageInputRef}
          placeholder="Ask me anything about your studies..."
          disabled={chat.isLoading || !settings.openRouterApiKey}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              const form = e.currentTarget.closest('form');
              if (form) {
                const syntheticEvent = {
                  preventDefault: () => {},
                } as Pick<React.FormEvent<HTMLFormElement>, 'preventDefault'>;
                void handleSendMessage(syntheticEvent as React.FormEvent<HTMLFormElement>);
              }
            }
          }}
        />
        <Button type="submit" disabled={chat.isLoading || !settings.openRouterApiKey}>
          {chat.isLoading ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={chat.clearMessages}
          disabled={chat.messages.length === 0}
          aria-label="Clear chat"
        >
          <Trash2 />
        </Button>
      </form>
    </div>
  );
}
