import type {
  Difficulty,
  EntityStatus,
  Flashcard,
  StudySession,
  Subject,
  Task,
  Topic,
} from '@/features/mvp/types';
import type {
  LearningAnalytics,
  LearningEngineInput,
  LearningIntelligence,
  LearningPriority,
  OverdueWorkItem,
  RevisionQueueItem,
  StudyHeatmapDay,
  SubjectReadiness,
  TopicInsight,
} from './types';

const DAY_MS = 86_400_000;

const priorityWeight: Record<Task['priority'], number> = {
  high: 25,
  medium: 14,
  low: 6,
};

const difficultyWeight: Record<Difficulty, number> = {
  hard: 24,
  medium: 12,
  easy: 4,
};

const statusCompletion: Record<Topic['status'], number> = {
  learning: 20,
  reviewing: 60,
  mastered: 100,
};

function startOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toDateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function parseDate(value?: string) {
  return value ? new Date(value) : undefined;
}

function daysBetween(from: Date, to: Date) {
  const fromStart = startOfDay(from);
  const toStart = startOfDay(to);
  return Math.round((toStart.getTime() - fromStart.getTime()) / DAY_MS);
}

function daysUntil(value: string | undefined, now: Date) {
  const date = parseDate(value);
  return date ? daysBetween(now, date) : undefined;
}

function isIncompleteTask(task: Task) {
  return task.status !== 'done';
}

function sessionMinutes(sessions: StudySession[]) {
  return sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
}

function subjectForTopic(
  topic: Topic,
  subjectsById: Map<string, Subject>,
  subjectIdByChapterId: Map<string, string>,
) {
  const subjectId = subjectIdByChapterId.get(topic.chapterId);
  return subjectId ? subjectsById.get(subjectId) : undefined;
}

function topicSubjectId(topic: Topic, subjectIdByChapterId: Map<string, string>) {
  return subjectIdByChapterId.get(topic.chapterId);
}

export function isSameStudyDay(a: Date, b: Date) {
  return daysBetween(a, b) === 0;
}

export function isDueOnOrBefore(value: string | undefined, now = new Date()) {
  const dueInDays = daysUntil(value, now);
  return dueInDays !== undefined && dueInDays <= 0;
}

export function calculateSubjectCompletion(
  subjectId: string,
  chapters: { id: string; subjectId: string }[],
  topics: Topic[],
) {
  const chapterIds = new Set(
    chapters.filter((chapter) => chapter.subjectId === subjectId).map((chapter) => chapter.id),
  );
  const subjectTopics = topics.filter((topic) => chapterIds.has(topic.chapterId));

  if (subjectTopics.length === 0) {
    return 0;
  }

  const total = subjectTopics.reduce((sum, topic) => sum + statusCompletion[topic.status], 0);
  return Math.round(total / subjectTopics.length);
}

export function calculateOverallCompletion(tasks: Task[], topics: Topic[]) {
  const completedTasks = tasks.filter((task) => task.status === 'done').length * 100;
  const topicCompletion = topics.reduce((sum, topic) => sum + statusCompletion[topic.status], 0);
  const totalItems = tasks.length + topics.length;

  if (totalItems === 0) {
    return 0;
  }

  return Math.round((completedTasks + topicCompletion) / totalItems);
}

export function calculateStudyStreak(sessions: StudySession[], now = new Date()) {
  const studiedDays = new Set(
    sessions.map((session) => toDateKey(startOfDay(new Date(session.date)))),
  );
  let streak = 0;
  const cursor = startOfDay(now);

  while (studiedDays.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function buildStudyHeatmap(
  sessions: StudySession[],
  goalMinutes: number,
  now = new Date(),
): StudyHeatmapDay[] {
  const today = startOfDay(now);

  return Array.from({ length: 28 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (27 - index));
    const minutes = sessions
      .filter((session) => isSameStudyDay(new Date(session.date), date))
      .reduce((sum, session) => sum + session.durationMinutes, 0);
    const ratio = goalMinutes > 0 ? minutes / goalMinutes : 0;

    return {
      date: toDateKey(date),
      day: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date),
      minutes,
      intensity: (ratio >= 1 ? 4 : ratio >= 0.66 ? 3 : ratio >= 0.33 ? 2 : minutes > 0 ? 1 : 0) as
        0 | 1 | 2 | 3 | 4,
    };
  });
}

function scoreTask(task: Task, now: Date) {
  const dueInDays = daysUntil(task.dueDate, now);
  const dueScore =
    dueInDays === undefined
      ? 10
      : dueInDays < 0
        ? 100 + Math.abs(dueInDays) * 12
        : dueInDays <= 7
          ? 72 + (7 - dueInDays) * 6
          : 18;
  const statusPenalty: Record<EntityStatus, number> = {
    todo: 0,
    in_progress: -8,
    done: -999,
  };

  return dueScore + priorityWeight[task.priority] + statusPenalty[task.status];
}

function scoreFlashcard(card: Flashcard, now: Date) {
  const dueInDays = daysUntil(card.dueDate, now) ?? 30;
  const dueScore =
    dueInDays < 0 ? 96 + Math.abs(dueInDays) * 8 : dueInDays === 0 ? 90 : 18 - dueInDays;
  const memoryPressure =
    Math.max(0, 8 - card.repetitions * 2) + Math.max(0, 2.5 - card.easeFactor) * 8;

  return dueScore + memoryPressure;
}

function scoreTopic({
  topic,
  sessions,
  now,
}: {
  topic: Topic;
  sessions: StudySession[];
  now: Date;
}) {
  const topicSessions = sessions.filter((session) => session.topicId === topic.id);
  const latestSession = topicSessions
    .map((session) => new Date(session.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  const daysSinceStudy = latestSession ? Math.max(0, daysBetween(latestSession, now)) : 30;
  const dueInDays = daysUntil(topic.nextReviewDate, now);
  const recencyScore = clamp(daysSinceStudy * 2, 0, 30);
  const reviewScore =
    dueInDays === undefined
      ? 8
      : dueInDays < 0
        ? 40 + Math.abs(dueInDays) * 5
        : dueInDays === 0
          ? 34
          : dueInDays <= 3
            ? 20
            : 4;
  const completionGap = 100 - statusCompletion[topic.status];

  return {
    daysSinceStudy,
    score: reviewScore + recencyScore + difficultyWeight[topic.difficulty] + completionGap * 0.25,
  };
}

function buildTopicInsights(input: LearningEngineInput) {
  const now = input.now ?? new Date();
  const subjectsById = new Map(input.subjects.map((subject) => [subject.id, subject]));
  const subjectIdByChapterId = new Map(
    input.chapters.map((chapter) => [chapter.id, chapter.subjectId]),
  );

  return input.topics.map<TopicInsight>((topic) => {
    const topicScore = scoreTopic({ topic, sessions: input.sessions, now });
    const reasons: string[] = [];

    if (topic.difficulty === 'hard') reasons.push('Hard difficulty');
    if (topic.status !== 'mastered') reasons.push(`${topic.status.replace('_', ' ')} status`);
    if (topicScore.daysSinceStudy >= 7)
      reasons.push(`Not studied for ${topicScore.daysSinceStudy} days`);
    if (isDueOnOrBefore(topic.nextReviewDate, now)) reasons.push('Revision due');
    if (reasons.length === 0) reasons.push('Recently reinforced');

    return {
      topic,
      subject: subjectForTopic(topic, subjectsById, subjectIdByChapterId),
      completion: statusCompletion[topic.status],
      score: Math.round(topicScore.score),
      reasons,
      daysSinceStudy: topicScore.daysSinceStudy,
    };
  });
}

function buildRevisionQueue(input: LearningEngineInput, topicInsights: TopicInsight[]) {
  const now = input.now ?? new Date();
  const cardItems = input.flashcards
    .filter((card) => isDueOnOrBefore(card.dueDate, now))
    .map<RevisionQueueItem>((card) => ({
      id: `flashcard-${card.id}`,
      title: card.front,
      type: 'flashcard',
      dueDate: card.dueDate,
      reason: 'Flashcard is due for spaced repetition',
      href: '/flashcards',
      score: Math.round(scoreFlashcard(card, now)),
    }));
  const topicItems = topicInsights
    .filter(
      (item) => item.topic.status !== 'mastered' && isDueOnOrBefore(item.topic.nextReviewDate, now),
    )
    .map<RevisionQueueItem>((item) => ({
      id: `topic-${item.topic.id}`,
      title: item.topic.name,
      type: 'topic',
      dueDate: item.topic.nextReviewDate,
      reason: item.reasons.join(', '),
      href: '/subjects',
      score: item.score,
    }));

  return [...cardItems, ...topicItems].sort((a, b) => b.score - a.score);
}

function buildSubjectReadiness(input: LearningEngineInput, weakTopics: TopicInsight[]) {
  const now = input.now ?? new Date();
  const subjectIdByChapterId = new Map(
    input.chapters.map((chapter) => [chapter.id, chapter.subjectId]),
  );
  const weakTopicCountBySubject = new Map<string, number>();
  const dueFlashcardsBySubject = new Map<string, number>();

  weakTopics.forEach((item) => {
    if (item.subject) {
      weakTopicCountBySubject.set(
        item.subject.id,
        (weakTopicCountBySubject.get(item.subject.id) ?? 0) + 1,
      );
    }
  });

  input.flashcards
    .filter((card) => isDueOnOrBefore(card.dueDate, now))
    .forEach((card) => {
      const topic = input.topics.find((candidate) => candidate.id === card.topicId);
      const subjectId = topic ? topicSubjectId(topic, subjectIdByChapterId) : undefined;
      if (subjectId) {
        dueFlashcardsBySubject.set(subjectId, (dueFlashcardsBySubject.get(subjectId) ?? 0) + 1);
      }
    });

  return input.subjects
    .map<SubjectReadiness>((subject) => {
      const completion = calculateSubjectCompletion(subject.id, input.chapters, input.topics);
      const recentSessions = input.sessions.filter(
        (session) =>
          session.subjectId === subject.id &&
          Math.max(0, daysBetween(new Date(session.date), now)) <= 6,
      );
      const minutesLastSevenDays = sessionMinutes(recentSessions);
      const dueTaskCount = input.tasks.filter(
        (task) =>
          task.subjectId === subject.id &&
          isIncompleteTask(task) &&
          (daysUntil(task.dueDate, now) ?? 99) <= 7,
      ).length;
      const dueFlashcardCount = dueFlashcardsBySubject.get(subject.id) ?? 0;
      const weakTopicCount = weakTopicCountBySubject.get(subject.id) ?? 0;
      const readiness = clamp(
        completion +
          Math.min(15, minutesLastSevenDays / 12) -
          dueTaskCount * 8 -
          dueFlashcardCount * 4 -
          weakTopicCount * 9,
        0,
        100,
      );
      const reasons = [
        `${completion}% completion`,
        `${Math.round(minutesLastSevenDays)}m studied this week`,
      ];

      if (dueTaskCount > 0)
        reasons.push(`${dueTaskCount} deadline${dueTaskCount === 1 ? '' : 's'} soon`);
      if (weakTopicCount > 0)
        reasons.push(`${weakTopicCount} weak topic${weakTopicCount === 1 ? '' : 's'}`);
      if (dueFlashcardCount > 0) {
        reasons.push(`${dueFlashcardCount} due flashcard${dueFlashcardCount === 1 ? '' : 's'}`);
      }

      return {
        subject,
        completion,
        readiness: Math.round(readiness),
        minutesLastSevenDays,
        dueTaskCount,
        dueFlashcardCount,
        weakTopicCount,
        reasons,
      };
    })
    .sort((a, b) => a.readiness - b.readiness);
}

function buildOverdueWork(input: LearningEngineInput) {
  const now = input.now ?? new Date();
  const overdueTasks = input.tasks
    .filter((task) => isIncompleteTask(task) && (daysUntil(task.dueDate, now) ?? 1) < 0)
    .map<OverdueWorkItem>((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      type: 'task',
      dueDate: task.dueDate,
      daysOverdue: Math.abs(daysUntil(task.dueDate, now) ?? 0),
      href: '/tasks',
      score: Math.round(scoreTask(task, now)),
    }));
  const overdueCards = input.flashcards
    .filter((card) => (daysUntil(card.dueDate, now) ?? 1) < 0)
    .map<OverdueWorkItem>((card) => ({
      id: `flashcard-${card.id}`,
      title: card.front,
      type: 'flashcard',
      dueDate: card.dueDate,
      daysOverdue: Math.abs(daysUntil(card.dueDate, now) ?? 0),
      href: '/flashcards',
      score: Math.round(scoreFlashcard(card, now)),
    }));

  return [...overdueTasks, ...overdueCards].sort((a, b) => b.score - a.score);
}

function buildPriorities({
  input,
  weakTopics,
  subjectReadiness,
}: {
  input: LearningEngineInput;
  weakTopics: TopicInsight[];
  subjectReadiness: SubjectReadiness[];
}) {
  const now = input.now ?? new Date();
  const todayMinutes = input.sessions
    .filter((session) => isSameStudyDay(new Date(session.date), now))
    .reduce((sum, session) => sum + session.durationMinutes, 0);
  const goalGap = Math.max(0, input.settings.dailyGoalMinutes - todayMinutes);
  const goalBump = Math.min(18, goalGap / 10);
  const priorities: LearningPriority[] = [];

  input.flashcards
    .filter((card) => isDueOnOrBefore(card.dueDate, now))
    .forEach((card) => {
      priorities.push({
        id: `flashcard-${card.id}`,
        kind: 'flashcard',
        title: card.front,
        reason: 'Due today in the revision queue',
        href: '/flashcards',
        score: Math.round(scoreFlashcard(card, now) + goalBump),
        priority: 0,
        estimatedMinutes: 5,
      });
    });

  input.tasks.filter(isIncompleteTask).forEach((task) => {
    const dueInDays = daysUntil(task.dueDate, now);
    if (dueInDays !== undefined && dueInDays <= 7) {
      priorities.push({
        id: `task-${task.id}`,
        kind: 'task',
        title: task.title,
        reason:
          dueInDays < 0
            ? `${Math.abs(dueInDays)} days overdue`
            : dueInDays === 0
              ? 'Due today'
              : `Due in ${dueInDays} days`,
        href: '/tasks',
        score: Math.round(scoreTask(task, now) + goalBump),
        priority: 0,
        estimatedMinutes: task.priority === 'high' ? 45 : 30,
      });
    }
  });

  weakTopics.slice(0, 6).forEach((item) => {
    priorities.push({
      id: `topic-${item.topic.id}`,
      kind: 'topic',
      title: item.topic.name,
      reason: item.reasons.join(', '),
      href: '/subjects',
      score: Math.round(item.score + goalBump),
      priority: 0,
      estimatedMinutes: item.topic.difficulty === 'hard' ? 35 : 25,
    });
  });

  input.exams.forEach((exam) => {
    const dueInDays = daysUntil(exam.date, now);
    if (dueInDays !== undefined && dueInDays >= 0 && dueInDays <= 14) {
      const readiness = subjectReadiness.find((item) => item.subject.id === exam.subjectId);
      priorities.push({
        id: `exam-${exam.id}`,
        kind: 'exam',
        title: exam.title,
        reason: `${dueInDays} days away${readiness ? `, ${readiness.readiness}% ready` : ''}`,
        href: '/calendar',
        score: Math.round(
          74 + (14 - dueInDays) * 3 + (readiness ? 100 - readiness.readiness : 0) * 0.3,
        ),
        priority: 0,
        estimatedMinutes: 40,
      });
    }
  });

  subjectReadiness.slice(0, 3).forEach((item) => {
    priorities.push({
      id: `subject-${item.subject.id}`,
      kind: 'subject',
      title: item.subject.name,
      reason: item.reasons.join(', '),
      href: '/subjects',
      score: Math.round(45 + (100 - item.readiness) * 0.45 + goalBump),
      priority: 0,
      estimatedMinutes: 30,
    });
  });

  if (goalGap > 0) {
    priorities.push({
      id: 'daily-goal',
      kind: 'goal',
      title: 'Close today’s study goal',
      reason: `${goalGap} minutes remaining today`,
      href: '/pomodoro',
      score: Math.round(52 + goalBump),
      priority: 0,
      estimatedMinutes: Math.min(goalGap, 45),
    });
  }

  return priorities
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({ ...item, priority: index + 1 }));
}

function buildAnalytics(
  input: LearningEngineInput,
  subjectReadiness: SubjectReadiness[],
): LearningAnalytics {
  const now = input.now ?? new Date();
  const heatmapData = buildStudyHeatmap(input.sessions, input.settings.dailyGoalMinutes, now);
  const lastSevenDays = heatmapData.slice(-7);
  const studiedDays = lastSevenDays.filter((day) => day.minutes > 0).length;
  const studiedTodayMinutes = input.sessions
    .filter((session) => isSameStudyDay(new Date(session.date), now))
    .reduce((sum, session) => sum + session.durationMinutes, 0);
  const studiedLastSevenDaysMinutes = lastSevenDays.reduce((sum, day) => sum + day.minutes, 0);
  const readinessScore =
    subjectReadiness.length === 0
      ? 0
      : Math.round(
          subjectReadiness.reduce((sum, item) => sum + item.readiness, 0) / subjectReadiness.length,
        );

  return {
    studyConsistency: Math.round((studiedDays / 7) * 100),
    heatmapData,
    readinessScore,
    dailyGoalCompletion:
      input.settings.dailyGoalMinutes > 0
        ? Math.round(clamp((studiedTodayMinutes / input.settings.dailyGoalMinutes) * 100, 0, 100))
        : 0,
    studiedTodayMinutes,
    studiedLastSevenDaysMinutes,
  };
}

export function analyzeLearning(input: LearningEngineInput): LearningIntelligence {
  const topicInsights = buildTopicInsights(input);
  const weakTopics = topicInsights
    .filter((item) => item.topic.status !== 'mastered')
    .sort((a, b) => b.score - a.score);
  const strongTopics = topicInsights
    .filter((item) => item.topic.status === 'mastered' || item.score < 35)
    .sort((a, b) => a.score - b.score);
  const subjectReadiness = buildSubjectReadiness(input, weakTopics);
  const todayPriorities = buildPriorities({ input, weakTopics, subjectReadiness });
  const analytics = buildAnalytics(input, subjectReadiness);

  return {
    todayPriorities,
    overdueWork: buildOverdueWork(input),
    weakTopics,
    strongTopics,
    studyRecommendations: todayPriorities,
    estimatedDailyStudyTime: todayPriorities
      .slice(0, 4)
      .reduce((sum, item) => sum + item.estimatedMinutes, 0),
    completionPercentage: calculateOverallCompletion(input.tasks, input.topics),
    subjectReadiness,
    studyStreak: calculateStudyStreak(input.sessions, input.now),
    revisionQueue: buildRevisionQueue(input, topicInsights),
    analytics,
  };
}
