import type { AIError, ChatCompletionRequest, ChatCompletionResponse, StreamChunk } from '../types';
import type { IAIProvider } from './IAIProvider';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

export class OpenRouterService implements IAIProvider {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(apiKey: string, baseUrl = OPENROUTER_BASE_URL, timeout = DEFAULT_TIMEOUT_MS) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private createHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer':
        typeof window !== 'undefined' ? window.location.origin : 'https://athena.local',
      'X-Title': 'Athena OS',
    };
  }

  private parseError(status: number, data: unknown): AIError {
    const message =
      typeof data === 'object' && data && 'error' in data
        ? (data as Record<string, unknown>).error
        : 'Unknown error';

    if (status === 401 || status === 403) {
      return {
        code: 'INVALID_API_KEY',
        message: 'Invalid or expired OpenRouter API key.',
        retryable: false,
        statusCode: status,
      };
    }

    if (status === 429) {
      return {
        code: 'RATE_LIMIT',
        message: 'Rate limit exceeded. Please try again in a moment.',
        retryable: true,
        statusCode: status,
      };
    }

    if (status === 500 || status === 502 || status === 503) {
      return {
        code: 'PROVIDER_ERROR',
        message: 'OpenRouter service is temporarily unavailable.',
        retryable: true,
        statusCode: status,
      };
    }

    return {
      code: 'PROVIDER_ERROR',
      message: `OpenRouter error: ${String(message)}`,
      retryable: false,
      statusCode: status,
    };
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    if (!this.apiKey) {
      throw {
        code: 'NO_API_KEY',
        message: 'OpenRouter API key is not configured.',
        retryable: false,
      } as AIError;
    }

    let lastError: AIError | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: this.createHeaders(),
          body: JSON.stringify({
            model: request.model.startsWith('openai/') ? request.model : `openai/${request.model}`,
            messages: request.messages,
            temperature: request.options?.temperature ?? 0.7,
            max_tokens: request.options?.maxTokens ?? 2000,
            top_p: request.options?.topP ?? 1,
            frequency_penalty: request.options?.frequencyPenalty ?? 0,
            presence_penalty: request.options?.presencePenalty ?? 0,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          lastError = this.parseError(response.status, data);

          if (!lastError.retryable || attempt === MAX_RETRIES - 1) {
            throw lastError;
          }

          const delayMs = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
          await this.delay(delayMs);
          continue;
        }

        const data = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
          usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
          model?: string;
        };

        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          throw {
            code: 'INVALID_REQUEST',
            message: 'Empty response from OpenRouter.',
            retryable: true,
          } as AIError;
        }

        return {
          content,
          model: data.model ?? request.model,
          usage: data.usage
            ? {
                promptTokens: data.usage.prompt_tokens ?? 0,
                completionTokens: data.usage.completion_tokens ?? 0,
                totalTokens: data.usage.total_tokens ?? 0,
              }
            : undefined,
        };
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          lastError = {
            code: 'NETWORK_ERROR',
            message: 'Network request failed. Check your connection.',
            retryable: true,
          };

          if (attempt === MAX_RETRIES - 1) {
            throw lastError;
          }

          const delayMs = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
          await this.delay(delayMs);
          continue;
        }

        if (error instanceof Error && error.name === 'AbortError') {
          throw {
            code: 'TIMEOUT',
            message: 'OpenRouter request timed out.',
            retryable: true,
          } as AIError;
        }

        throw error;
      }
    }

    throw (
      lastError ?? {
        code: 'PROVIDER_ERROR',
        message: 'Failed to complete request after multiple retries.',
        retryable: false,
      }
    );
  }

  async *stream(request: ChatCompletionRequest): AsyncIterable<StreamChunk> {
    if (!this.apiKey) {
      yield {
        type: 'error',
        error: 'OpenRouter API key is not configured.',
      };
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.createHeaders(),
        body: JSON.stringify({
          model: request.model.startsWith('openai/') ? request.model : `openai/${request.model}`,
          messages: request.messages,
          temperature: request.options?.temperature ?? 0.7,
          max_tokens: request.options?.maxTokens ?? 2000,
          stream: true,
          top_p: request.options?.topP ?? 1,
          frequency_penalty: request.options?.frequencyPenalty ?? 0,
          presence_penalty: request.options?.presencePenalty ?? 0,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = this.parseError(response.status, data);
        yield {
          type: 'error',
          error: error.message,
        };
        return;
      }

      if (!response.body) {
        yield {
          type: 'error',
          error: 'No response body from OpenRouter.',
        };
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      yield { type: 'start' };

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line || line === '[DONE]' || !line.startsWith('data: ')) {
              continue;
            }

            const jsonStr = line.slice(6);

            try {
              const data = JSON.parse(jsonStr) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const content = data.choices?.[0]?.delta?.content;

              if (content) {
                yield { type: 'content', content };
              }
            } catch {
              // Parse error for this line; continue to next
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      yield { type: 'end' };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        yield {
          type: 'error',
          error: 'Request timed out.',
        };
      } else {
        yield {
          type: 'error',
          error: 'Stream failed.',
        };
      }
    }
  }

  async validate(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: this.createHeaders(),
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}
