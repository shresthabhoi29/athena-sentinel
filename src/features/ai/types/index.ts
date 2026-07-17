export type AIModel = 'gpt-4o-mini' | 'gpt-4o' | 'claude-3-sonnet' | 'claude-3-haiku';

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type ChatCompletionOptions = {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
};

export type ChatCompletionRequest = {
  model: AIModel;
  messages: ChatMessage[];
  options?: ChatCompletionOptions;
};

export type ChatCompletionResponse = {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};

export type StreamChunk = {
  type: 'start' | 'content' | 'end' | 'error';
  content?: string;
  error?: string;
};

export type AIProviderConfig = {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
};

export type AIError = {
  code:
    | 'NO_API_KEY'
    | 'INVALID_API_KEY'
    | 'RATE_LIMIT'
    | 'TIMEOUT'
    | 'NETWORK_ERROR'
    | 'PROVIDER_ERROR'
    | 'INVALID_REQUEST';
  message: string;
  retryable: boolean;
  statusCode?: number;
};

export type AIContextData = {
  currentPriorities: Array<{
    title: string;
    reason: string;
    estimatedMinutes: number;
  }>;
  subjects: Array<{
    name: string;
    completion: number;
    readiness: number;
  }>;
  todayStats: {
    studiedMinutes: number;
    goalMinutes: number;
    streak: number;
    completionPercent: number;
  };
  weakTopics: Array<{
    name: string;
    reasons: string[];
  }>;
};
