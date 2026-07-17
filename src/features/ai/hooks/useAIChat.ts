'use client';

import { useCallback, useState } from 'react';
import type { ChatMessage as AIChatMessage, AIError } from '../types';
import { chatCompletionAction } from '../services/actions';

export type UseAIChatState = {
  messages: AIChatMessage[];
  isLoading: boolean;
  error: AIError | null;
};

export type UseAIChatActions = {
  sendMessage: (content: string, systemMessage?: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
};

/**
 * Hook for managing AI chat conversations.
 * Handles message history, loading state, and error handling.
 */
export function useAIChat(apiKey: string): UseAIChatState & UseAIChatActions {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AIError | null>(null);

  const sendMessage = useCallback(
    async (content: string, systemMessage?: string) => {
      if (!content.trim() || isLoading) {
        return;
      }

      if (!apiKey) {
        setError({
          code: 'NO_API_KEY',
          message: 'API key is not configured.',
          retryable: false,
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      // Add user message to history
      const userMessage: AIChatMessage = {
        role: 'user',
        content,
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      try {
        // Build request with optional system message
        const requestMessages: AIChatMessage[] = [];

        if (systemMessage) {
          requestMessages.push({
            role: 'system',
            content: systemMessage,
          });
        }

        // Include last 10 messages for context
        requestMessages.push(...updatedMessages.slice(-10));

        const result = await chatCompletionAction(apiKey, {
          model: 'gpt-4o-mini',
          messages: requestMessages,
          options: {
            temperature: 0.7,
            maxTokens: 2000,
          },
        });

        if (!result.success) {
          setError(result.error);
          return;
        }

        const assistantMessage: AIChatMessage = {
          role: 'assistant',
          content: result.data.content,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError({
          code: 'PROVIDER_ERROR',
          message: err instanceof Error ? err.message : 'Failed to send message.',
          retryable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, isLoading, messages],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    clearError,
  };
}
