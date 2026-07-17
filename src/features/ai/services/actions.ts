'use server';

import type { ChatCompletionRequest, ChatCompletionResponse, AIError } from '../types';
import { OpenRouterService } from '../providers/OpenRouterService';

/**
 * Server-side chat completion action.
 * The API key is never exposed to the client.
 * Called from client components via the useAIChat hook.
 */
export async function chatCompletionAction(
  apiKey: string,
  request: ChatCompletionRequest,
): Promise<{ success: false; error: AIError } | { success: true; data: ChatCompletionResponse }> {
  if (!apiKey) {
    return {
      success: false,
      error: {
        code: 'NO_API_KEY',
        message: 'API key is required.',
        retryable: false,
      },
    };
  }

  // Validate that API key looks reasonable (basic check)
  if (!apiKey.startsWith('sk-or-') && apiKey.length < 20) {
    return {
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'API key format is invalid.',
        retryable: false,
      },
    };
  }

  try {
    const service = new OpenRouterService(apiKey);
    const response = await service.chat(request);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      return {
        success: false,
        error: error as AIError,
      };
    }

    return {
      success: false,
      error: {
        code: 'PROVIDER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred.',
        retryable: false,
      },
    };
  }
}

/**
 * Validate OpenRouter API key.
 */
export async function validateAPIKeyAction(apiKey: string): Promise<boolean> {
  if (!apiKey) {
    return false;
  }

  try {
    const service = new OpenRouterService(apiKey);
    return await service.validate();
  } catch {
    return false;
  }
}
