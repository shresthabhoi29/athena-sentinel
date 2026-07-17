import type { ChatCompletionRequest, ChatCompletionResponse, StreamChunk } from '../types';

/**
 * Abstract AI Provider interface.
 * Implementations handle specific AI service integrations (OpenRouter, Anthropic, etc.)
 * The application depends only on this interface, never on specific providers.
 */
export interface IAIProvider {
  /**
   * Send a chat completion request and receive the full response.
   */
  chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;

  /**
   * Send a chat completion request and stream the response.
   * Caller is responsible for consuming the async iterator.
   */
  stream(request: ChatCompletionRequest): AsyncIterable<StreamChunk>;

  /**
   * Validate provider configuration and connectivity.
   */
  validate(): Promise<boolean>;
}
