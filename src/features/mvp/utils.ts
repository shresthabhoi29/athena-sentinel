import {
  calculateOverallCompletion,
  calculateStudyStreak,
  calculateSubjectCompletion,
  isDueOnOrBefore,
} from '@/features/learning-engine';
import type { StudySession, Subject, Task, Topic } from './types';

export function formatDate(value?: string) {
  if (!value) {
    return 'No date';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(value?: string) {
  return Boolean(value && isSameDay(new Date(value), new Date()));
}

export function isPastOrToday(value?: string) {
  return isDueOnOrBefore(value);
}

export function daysUntil(value: string) {
  const target = new Date(value);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

export function subjectProgress(
  subjectId: string,
  chapters: { id: string; subjectId: string }[],
  topics: Topic[],
) {
  return calculateSubjectCompletion(subjectId, chapters, topics);
}

export function weeklyStudyHours(sessions: StudySession[]) {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const minutes = sessions
      .filter((session) => isSameDay(new Date(session.date), date))
      .reduce((sum, session) => sum + session.durationMinutes, 0);

    return {
      day: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date),
      hours: Number((minutes / 60).toFixed(1)),
      minutes,
    };
  });
}

export function dailyStudyHours(sessions: StudySession[]) {
  return weeklyStudyHours(sessions).map((item) => ({
    ...item,
    value: item.hours,
  }));
}

export function subjectDistribution(subjects: Subject[], sessions: StudySession[]) {
  return subjects.map((subject) => {
    const minutes = sessions
      .filter((session) => session.subjectId === subject.id)
      .reduce((sum, session) => sum + session.durationMinutes, 0);

    return {
      name: subject.name,
      value: minutes,
      fill: subject.color,
    };
  });
}

export function studyStreak(sessions: StudySession[]) {
  return calculateStudyStreak(sessions);
}

export function completionPercentage(tasks: Task[], topics: Topic[]) {
  return calculateOverallCompletion(tasks, topics);
}
