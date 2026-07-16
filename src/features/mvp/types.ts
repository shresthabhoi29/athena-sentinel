export type EntityStatus = 'todo' | 'in_progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type TopicStatus = 'learning' | 'reviewing' | 'mastered';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type SessionType = 'pomodoro' | 'self_study' | 'revision' | 'flashcards';

export type Subject = {
  id: string;
  name: string;
  color: string;
  description: string;
  createdAt: string;
};

export type Chapter = {
  id: string;
  subjectId: string;
  name: string;
  orderIndex: number;
};

export type Topic = {
  id: string;
  chapterId: string;
  name: string;
  status: TopicStatus;
  difficulty: Difficulty;
  lastReviewedAt?: string;
  nextReviewDate?: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  topicId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: EntityStatus;
  priority: Priority;
  dueDate?: string;
  subjectId?: string;
  createdAt: string;
};

export type StudySession = {
  id: string;
  subjectId?: string;
  topicId?: string;
  durationMinutes: number;
  date: string;
  type: SessionType;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  topicId?: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: string;
  lastReviewedAt?: string;
  createdAt: string;
};

export type Exam = {
  id: string;
  title: string;
  subjectId: string;
  date: string;
};

export type Resource = {
  id: string;
  title: string;
  url: string;
  type: string;
  subjectId?: string;
};

export type AthenaSettings = {
  dailyGoalMinutes: number;
  pomodoroWorkDuration: number;
  pomodoroShortBreak: number;
  pomodoroLongBreak: number;
  openRouterApiKey: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};
