import type { LearningIntelligence } from '@/features/learning-engine';
import type { Subject } from '@/features/mvp/types';
import type { AIContextData } from '../types';

/**
 * Build lightweight AI context from current study state.
 * Only includes essential information to keep token usage low.
 */
export function buildAIContext(
  intelligence: LearningIntelligence,
  subjects: Subject[],
  settings: { dailyGoalMinutes: number },
): AIContextData {
  // Top 3 priorities only
  const topPriorities = intelligence.todayPriorities.slice(0, 3);

  // Subject readiness summary (top 5 only)
  const subjectSummary = intelligence.subjectReadiness.slice(0, 5).map((item) => ({
    name: item.subject.name,
    completion: item.completion,
    readiness: item.readiness,
  }));

  // Today's stats
  const todayStats = {
    studiedMinutes: intelligence.analytics.studiedTodayMinutes,
    goalMinutes: settings.dailyGoalMinutes,
    streak: intelligence.studyStreak,
    completionPercent: intelligence.completionPercentage,
  };

  // Top 3 weak topics
  const weakTopics = intelligence.weakTopics.slice(0, 3).map((item) => ({
    name: item.topic.name,
    reasons: item.reasons,
  }));

  return {
    currentPriorities: topPriorities.map((p) => ({
      title: p.title,
      reason: p.reason,
      estimatedMinutes: p.estimatedMinutes,
    })),
    subjects: subjectSummary,
    todayStats,
    weakTopics,
  };
}

/**
 * Format AI context as a system message.
 * Provides Athena with current study state without overwhelming the context.
 */
export function formatContextSystemMessage(context: AIContextData): string {
  const lines = [
    'You are Athena OS, a concise and practical study coach for students.',
    'Provide clear, actionable advice using markdown when appropriate.',
    '',
    '## Current Study Status',
    `Study Streak: ${context.todayStats.streak} days`,
    `Today's Progress: ${context.todayStats.studiedMinutes}/${context.todayStats.goalMinutes} minutes`,
    `Overall Completion: ${context.todayStats.completionPercent}%`,
    '',
    "## Today's Top Priorities",
    ...context.currentPriorities.map(
      (p, i) => `${i + 1}. ${p.title} (${p.reason}) - ${p.estimatedMinutes}m`,
    ),
    '',
    '## Subject Readiness',
    ...context.subjects.map((s) => `- ${s.name}: ${s.completion}% complete, ${s.readiness}% ready`),
    '',
    '## Areas to Focus',
    ...context.weakTopics.map((t) => `- ${t.name}: ${t.reasons.join(', ')}`),
    '',
    'Use this context to provide relevant, personalized study advice.',
    'Keep responses concise unless asked for detail.',
  ];

  return lines.join('\n');
}
