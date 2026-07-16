import type { Exam, Flashcard, StudySession, Subject, Task, Topic } from './types';

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
  if (!value) {
    return false;
  }

  const target = new Date(value);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target <= today;
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
  const chapterIds = chapters
    .filter((chapter) => chapter.subjectId === subjectId)
    .map((chapter) => chapter.id);
  const subjectTopics = topics.filter((topic) => chapterIds.includes(topic.chapterId));

  if (subjectTopics.length === 0) {
    return 0;
  }

  const completed = subjectTopics.filter((topic) => topic.status === 'mastered').length;
  return Math.round((completed / subjectTopics.length) * 100);
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
  let streak = 0;
  const cursor = new Date();

  while (
    sessions.some((session) => {
      const sessionDate = new Date(session.date);
      return isSameDay(sessionDate, cursor);
    })
  ) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function completionPercentage(tasks: Task[], topics: Topic[]) {
  const taskDone = tasks.filter((task) => task.status === 'done').length;
  const topicDone = topics.filter((topic) => topic.status === 'mastered').length;
  const total = tasks.length + topics.length;

  if (total === 0) {
    return 0;
  }

  return Math.round(((taskDone + topicDone) / total) * 100);
}

export type Recommendation = {
  id: string;
  title: string;
  reason: string;
  href: string;
  priority: number;
};

export function buildRecommendations({
  flashcards,
  tasks,
  topics,
  exams,
  subjects,
}: {
  flashcards: Flashcard[];
  tasks: Task[];
  topics: Topic[];
  exams: Exam[];
  subjects: Subject[];
}) {
  const overdueCards = flashcards
    .filter((card) => isPastOrToday(card.dueDate))
    .slice(0, 3)
    .map((card) => ({
      id: `card-${card.id}`,
      title: card.front,
      reason: 'Overdue flashcard',
      href: '/flashcards',
      priority: 1,
    }));

  const dueTasks = tasks
    .filter((task) => task.status !== 'done' && isPastOrToday(task.dueDate))
    .slice(0, 3)
    .map((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      reason: 'Due task',
      href: '/tasks',
      priority: 2,
    }));

  const weakTopics = topics
    .filter((topic) => topic.status !== 'mastered' && topic.difficulty === 'hard')
    .slice(0, 3)
    .map((topic) => ({
      id: `topic-${topic.id}`,
      title: topic.name,
      reason: 'Weak topic',
      href: '/subjects',
      priority: 3,
    }));

  const upcomingExams = exams
    .filter((exam) => daysUntil(exam.date) >= 0 && daysUntil(exam.date) <= 14)
    .slice(0, 2)
    .map((exam) => ({
      id: `exam-${exam.id}`,
      title: exam.title,
      reason: `${daysUntil(exam.date)} days until exam`,
      href: '/calendar',
      priority: 4,
    }));

  const activeSubjects = subjects.slice(0, 2).map((subject) => ({
    id: `subject-${subject.id}`,
    title: subject.name,
    reason: 'Active subject',
    href: '/subjects',
    priority: 5,
  }));

  return [...overdueCards, ...dueTasks, ...weakTopics, ...upcomingExams, ...activeSubjects].sort(
    (a, b) => a.priority - b.priority,
  );
}
