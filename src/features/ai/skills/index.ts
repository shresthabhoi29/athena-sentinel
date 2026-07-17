import type { LearningIntelligence } from '@/features/learning-engine';
import { buildPrompt } from '../prompts';

/**
 * Skill: "What should I study today?"
 * Uses learning engine priorities to explain today's study plan.
 */
export function whatToStudySkill(
  intelligence: LearningIntelligence,
  settings: { dailyGoalMinutes: number },
) {
  const topPriorities = intelligence.todayPriorities.slice(0, 3);
  const overdueWork = intelligence.overdueWork.length;
  const dueFlashcards = intelligence.revisionQueue.filter(
    (item) => item.type === 'flashcard',
  ).length;
  const examsWithin14Days = 5; // Simplified for now

  const prioritiesText = topPriorities
    .map((p, i) => `${i + 1}. ${p.title} (${p.estimatedMinutes}m) - ${p.reason}`)
    .join('\n');

  const systemMessage = buildPrompt('whatToStudy', {
    priorities: prioritiesText,
    overdueCount: overdueWork,
    dueFlashcardCount: dueFlashcards,
    weakTopicCount: intelligence.weakTopics.length,
    upcomingExamCount: examsWithin14Days,
    dailyGoal: settings.dailyGoalMinutes,
    studiedToday: intelligence.analytics.studiedTodayMinutes,
    streak: intelligence.studyStreak,
  });

  return systemMessage;
}

/**
 * Skill: "Explain my weakest subject."
 * Uses subject readiness and topic insights.
 */
export function explainWeakestSkill(intelligence: LearningIntelligence) {
  const weakestSubject = intelligence.subjectReadiness[0];

  if (!weakestSubject) {
    return 'The student has no subjects yet. Cannot explain weakest subject.';
  }

  const weakTopicsInSubject = intelligence.weakTopics
    .filter((t) => t.subject?.id === weakestSubject.subject.id)
    .slice(0, 5);

  const weakTopicsText = weakTopicsInSubject
    .map((t) => `- ${t.topic.name} (${t.completion}% complete): ${t.reasons.join(', ')}`)
    .join('\n');

  const lastStudied =
    weakestSubject.minutesLastSevenDays > 0
      ? `${weakestSubject.minutesLastSevenDays}m this week`
      : 'Not studied this week';

  const systemMessage = buildPrompt('explainWeakest', {
    subjectName: weakestSubject.subject.name,
    completion: weakestSubject.completion,
    readiness: weakestSubject.readiness,
    minutesLastWeek: weakestSubject.minutesLastSevenDays,
    weakTopics: weakTopicsText || 'All topics are at least partially understood.',
    lastStudied,
    totalSessions: 5, // Simplified; would need session count
  });

  return systemMessage;
}

/**
 * Skill: "Summarize today's progress."
 * Uses study sessions and task completion.
 */
export function summarizeProgressSkill(
  intelligence: LearningIntelligence,
  settings: { dailyGoalMinutes: number },
) {
  const studiedToday = intelligence.analytics.studiedTodayMinutes;
  const completedTasksApprox = 2; // Simplified; would need to filter tasks

  // Build subject breakdown
  const subjectBreakdown = intelligence.subjectReadiness
    .slice(0, 4)
    .map((s) => `- ${s.subject.name}: ${s.completion}% complete`)
    .join('\n');

  const systemMessage = buildPrompt('summarizeProgress', {
    sessionCount: 3, // Simplified
    totalMinutes: studiedToday,
    dailyGoal: settings.dailyGoalMinutes,
    completedTasks: completedTasksApprox,
    pomodoroCount: 2, // Simplified
    subjectBreakdown,
  });

  return systemMessage;
}

/**
 * Skill: "What should I revise?"
 * Uses revision queue and flashcard data.
 */
export function whatToReviseSkill(intelligence: LearningIntelligence) {
  const revisionQueue = intelligence.revisionQueue.slice(0, 5);

  const revisionText = revisionQueue
    .map(
      (item) => `- ${item.title} (${item.type}) - due ${item.dueDate || 'today'} - ${item.reason}`,
    )
    .join('\n');

  const topicsNeedingReview = intelligence.weakTopics
    .slice(0, 3)
    .map((t) => `- ${t.topic.name} (studied ${t.daysSinceStudy || 0} days ago)`)
    .join('\n');

  const systemMessage = buildPrompt('whatToRevise', {
    revisionQueue: revisionText || 'No revision due today.',
    dueFlashcardCount: intelligence.revisionQueue.filter((r) => r.type === 'flashcard').length,
    averageEaseFactor: 2.5, // Simplified
    topicsNeedingReview,
  });

  return systemMessage;
}

/**
 * Skill: "Am I on track?"
 * Uses analytics and readiness data.
 */
export function amIOnTrackSkill(
  intelligence: LearningIntelligence,
  settings: { dailyGoalMinutes: number },
) {
  const studiedToday = intelligence.analytics.studiedTodayMinutes;
  const dailyGoal = settings.dailyGoalMinutes;
  const onTrackToday = studiedToday >= dailyGoal ? 'Yes' : 'Not yet';

  const weeklyGoal = dailyGoal * 7;
  const studiedWeek = intelligence.analytics.studiedLastSevenDaysMinutes;
  const onTrackWeek = studiedWeek >= weeklyGoal ? 'Yes' : 'Behind';

  const subjectReadinessText = intelligence.subjectReadiness
    .slice(0, 4)
    .map((s) => `- ${s.subject.name}: ${s.readiness}% ready`)
    .join('\n');

  const systemMessage = buildPrompt('amIOnTrack', {
    dailyGoal,
    studiedToday,
    onTrackToday,
    weeklyGoal,
    studiedThisWeek: studiedWeek,
    onTrackWeek,
    streak: intelligence.studyStreak,
    studyDaysThisWeek: intelligence.analytics.studyConsistency > 0 ? 5 : 2,
    consistency: intelligence.analytics.studyConsistency,
    subjectReadiness: subjectReadinessText,
  });

  return systemMessage;
}
