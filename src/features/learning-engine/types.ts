import type {
  AthenaSettings,
  Chapter,
  Exam,
  Flashcard,
  StudySession,
  Subject,
  Task,
  Topic,
} from '@/features/mvp/types';

export type LearningEngineInput = {
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
  tasks: Task[];
  sessions: StudySession[];
  flashcards: Flashcard[];
  exams: Exam[];
  settings: AthenaSettings;
  now?: Date;
};

export type PriorityKind = 'flashcard' | 'task' | 'topic' | 'exam' | 'subject' | 'goal';

export type LearningPriority = {
  id: string;
  kind: PriorityKind;
  title: string;
  reason: string;
  href: string;
  score: number;
  priority: number;
  estimatedMinutes: number;
};

export type TopicInsight = {
  topic: Topic;
  subject?: Subject;
  completion: number;
  score: number;
  reasons: string[];
  daysSinceStudy?: number;
};

export type RevisionQueueItem = {
  id: string;
  title: string;
  type: 'flashcard' | 'topic';
  dueDate?: string;
  reason: string;
  href: string;
  score: number;
};

export type SubjectReadiness = {
  subject: Subject;
  completion: number;
  readiness: number;
  minutesLastSevenDays: number;
  dueTaskCount: number;
  dueFlashcardCount: number;
  weakTopicCount: number;
  reasons: string[];
};

export type OverdueWorkItem = {
  id: string;
  title: string;
  type: 'task' | 'flashcard';
  dueDate?: string;
  daysOverdue: number;
  href: string;
  score: number;
};

export type StudyHeatmapDay = {
  date: string;
  day: string;
  minutes: number;
  intensity: 0 | 1 | 2 | 3 | 4;
};

export type LearningAnalytics = {
  studyConsistency: number;
  heatmapData: StudyHeatmapDay[];
  readinessScore: number;
  dailyGoalCompletion: number;
  studiedTodayMinutes: number;
  studiedLastSevenDaysMinutes: number;
};

export type LearningIntelligence = {
  todayPriorities: LearningPriority[];
  overdueWork: OverdueWorkItem[];
  weakTopics: TopicInsight[];
  strongTopics: TopicInsight[];
  studyRecommendations: LearningPriority[];
  estimatedDailyStudyTime: number;
  completionPercentage: number;
  subjectReadiness: SubjectReadiness[];
  studyStreak: number;
  revisionQueue: RevisionQueueItem[];
  analytics: LearningAnalytics;
};
