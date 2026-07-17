// Public API exports for the AI feature

// Types
export type {
  AIModel,
  ChatMessage as AIChatMessage,
  ChatCompletionOptions,
  ChatCompletionRequest,
  ChatCompletionResponse,
  StreamChunk,
  AIProviderConfig,
  AIError,
  AIContextData,
} from './types';

// Providers
export type { IAIProvider } from './providers/IAIProvider';
export { OpenRouterService } from './providers/OpenRouterService';

// Services
export { buildAIContext, formatContextSystemMessage } from './services/contextBuilder';
export { chatCompletionAction, validateAPIKeyAction } from './services/actions';
export {
  detectSkill,
  buildSkillSystemMessage,
  suggestedPrompts,
  type SkillType,
  type SuggestedPrompt,
} from './services/skillDetector';

// Hooks
export { useAIChat } from './hooks/useAIChat';
export type { UseAIChatState, UseAIChatActions } from './hooks/useAIChat';

// Components
export { AthenaAssistant } from './components/AthenaAssistant';

// Prompts
export { buildPrompt, promptTemplates, type PromptTemplate } from './prompts';

// Skills
export {
  whatToStudySkill,
  explainWeakestSkill,
  summarizeProgressSkill,
  whatToReviseSkill,
  amIOnTrackSkill,
} from './skills';
