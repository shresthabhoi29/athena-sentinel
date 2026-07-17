import type { LearningIntelligence } from '@/features/learning-engine';
import type { AthenaSettings } from '@/features/mvp/types';
import {
  whatToStudySkill,
  explainWeakestSkill,
  summarizeProgressSkill,
  whatToReviseSkill,
  amIOnTrackSkill,
} from '@/features/ai/skills';

export type SkillType =
  'whatToStudy' | 'explainWeakest' | 'summarizeProgress' | 'whatToRevise' | 'amIOnTrack' | null;

export interface SuggestedPrompt {
  label: string;
  text: string;
  skillType: SkillType;
}

/**
 * Detect which skill (if any) matches the user's message.
 * Keywords trigger appropriate skills.
 */
export function detectSkill(message: string): SkillType {
  const lower = message.toLowerCase().trim();

  if (
    lower.includes('should i study') ||
    lower.includes('what to study') ||
    lower.includes('what should i focus') ||
    lower.includes('priority') ||
    lower.includes('next') ||
    lower === 'what should i study today?'
  ) {
    return 'whatToStudy';
  }

  if (
    lower.includes('weakest') ||
    lower.includes('struggling') ||
    lower.includes('worst subject') ||
    lower.includes('explain my') ||
    lower === 'explain my weakest subject.'
  ) {
    return 'explainWeakest';
  }

  if (
    lower.includes("today's progress") ||
    lower.includes('summarize') ||
    lower.includes('how did i do') ||
    lower.includes('summary') ||
    lower === "summarize today's progress."
  ) {
    return 'summarizeProgress';
  }

  if (
    lower.includes('revise') ||
    lower.includes('review') ||
    lower.includes('flashcard') ||
    lower === 'what should i revise?'
  ) {
    return 'whatToRevise';
  }

  if (
    lower.includes('on track') ||
    lower.includes('pace') ||
    lower.includes('goals') ||
    lower.includes('am i') ||
    lower === 'am i on track?'
  ) {
    return 'amIOnTrack';
  }

  return null;
}

/**
 * Build system message for the detected skill.
 * Returns null if no skill is detected (generic chat).
 */
export function buildSkillSystemMessage(
  skill: SkillType,
  intelligence: LearningIntelligence,
  settings: AthenaSettings,
): string | null {
  switch (skill) {
    case 'whatToStudy':
      return whatToStudySkill(intelligence, settings);
    case 'explainWeakest':
      return explainWeakestSkill(intelligence);
    case 'summarizeProgress':
      return summarizeProgressSkill(intelligence, settings);
    case 'whatToRevise':
      return whatToReviseSkill(intelligence);
    case 'amIOnTrack':
      return amIOnTrackSkill(intelligence, settings);
    default:
      return null;
  }
}

/**
 * Get all suggested prompts.
 */
export const suggestedPrompts: SuggestedPrompt[] = [
  {
    label: 'Study Plan',
    text: 'What should I study today?',
    skillType: 'whatToStudy',
  },
  {
    label: 'Weakest Subject',
    text: 'Explain my weakest subject.',
    skillType: 'explainWeakest',
  },
  {
    label: "Today's Progress",
    text: "Summarize today's progress.",
    skillType: 'summarizeProgress',
  },
  {
    label: 'Revision Queue',
    text: 'What should I revise?',
    skillType: 'whatToRevise',
  },
  {
    label: 'Progress Check',
    text: 'Am I on track?',
    skillType: 'amIOnTrack',
  },
];
