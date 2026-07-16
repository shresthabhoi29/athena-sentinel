'use client';

import { Loader2, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownPreview } from './Markdown';
import { useWorkspaceStore } from '../store';

export function AIChat() {
  const { settings, chatMessages, addChatMessage, clearChat } = useWorkspaceStore();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage() {
    const text = prompt.trim();

    if (!text || isLoading) {
      return;
    }

    addChatMessage({ role: 'user', content: text });
    setPrompt('');

    if (!settings.openRouterApiKey) {
      addChatMessage({
        role: 'assistant',
        content: 'Add your OpenRouter API key in Settings to enable live AI responses.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${settings.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
          'X-Title': 'Athena OS',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are Athena OS, a concise study coach. Give practical, student-friendly answers with markdown.',
            },
            ...chatMessages.slice(-10).map((message) => ({
              role: message.role,
              content: message.content,
            })),
            { role: 'user', content: text },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('OpenRouter request failed.');
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      addChatMessage({
        role: 'assistant',
        content: data.choices?.[0]?.message?.content ?? 'I could not generate a response.',
      });
    } catch {
      addChatMessage({
        role: 'assistant',
        content: 'The AI request failed. Check your API key and network connection.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[34rem] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`rounded-xl border p-3 ${
              message.role === 'user'
                ? 'ml-8 border-indigo-400/20 bg-indigo-500/10'
                : 'mr-8 border-white/10 bg-white/[0.03]'
            }`}
          >
            <MarkdownPreview content={message.content} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void sendMessage();
            }
          }}
          placeholder="Ask Athena to plan, explain, or quiz you..."
        />
        <Button type="button" onClick={sendMessage} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={clearChat}
          aria-label="Clear chat"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
