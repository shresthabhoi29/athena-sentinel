import type {
  AthenaSettings,
  Chapter,
  ChatMessage,
  Exam,
  Flashcard,
  Note,
  Resource,
  StudySession,
  Subject,
  Task,
  Topic,
} from './types';

const now = new Date();
const iso = (offsetDays = 0) => {
  const date = new Date(now);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString();
};

export const seedSubjects: Subject[] = [
  {
    id: 'sub-math',
    name: 'Mathematics',
    color: '#818CF8',
    description: 'Calculus, algebra, and problem solving.',
    createdAt: iso(-28),
  },
  {
    id: 'sub-physics',
    name: 'Physics',
    color: '#34D399',
    description: 'Mechanics, waves, and revision drills.',
    createdAt: iso(-24),
  },
  {
    id: 'sub-cs',
    name: 'Computer Science',
    color: '#F472B6',
    description: 'Algorithms, systems, and programming notes.',
    createdAt: iso(-18),
  },
];

export const seedChapters: Chapter[] = [
  { id: 'chap-calc', subjectId: 'sub-math', name: 'Differential Calculus', orderIndex: 1 },
  { id: 'chap-prob', subjectId: 'sub-math', name: 'Probability', orderIndex: 2 },
  { id: 'chap-mech', subjectId: 'sub-physics', name: 'Mechanics', orderIndex: 1 },
  { id: 'chap-waves', subjectId: 'sub-physics', name: 'Waves', orderIndex: 2 },
  { id: 'chap-dsa', subjectId: 'sub-cs', name: 'Data Structures', orderIndex: 1 },
];

export const seedTopics: Topic[] = [
  {
    id: 'topic-derivatives',
    chapterId: 'chap-calc',
    name: 'Derivatives',
    status: 'reviewing',
    difficulty: 'medium',
    lastReviewedAt: iso(-2),
    nextReviewDate: iso(1),
  },
  {
    id: 'topic-integrals',
    chapterId: 'chap-calc',
    name: 'Applications of Derivatives',
    status: 'learning',
    difficulty: 'hard',
    nextReviewDate: iso(0),
  },
  {
    id: 'topic-bayes',
    chapterId: 'chap-prob',
    name: 'Bayes Theorem',
    status: 'mastered',
    difficulty: 'medium',
    lastReviewedAt: iso(-1),
    nextReviewDate: iso(5),
  },
  {
    id: 'topic-newton',
    chapterId: 'chap-mech',
    name: 'Newton Laws',
    status: 'reviewing',
    difficulty: 'easy',
    lastReviewedAt: iso(-3),
    nextReviewDate: iso(-1),
  },
  {
    id: 'topic-arrays',
    chapterId: 'chap-dsa',
    name: 'Arrays and Hashing',
    status: 'learning',
    difficulty: 'medium',
    nextReviewDate: iso(2),
  },
];

export const seedTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Solve calculus worksheet',
    description: 'Finish questions 11-25 and mark doubts.',
    status: 'in_progress',
    priority: 'high',
    dueDate: iso(0),
    subjectId: 'sub-math',
    createdAt: iso(-2),
  },
  {
    id: 'task-2',
    title: 'Revise Newton laws',
    description: 'Review examples and make three flashcards.',
    status: 'todo',
    priority: 'medium',
    dueDate: iso(1),
    subjectId: 'sub-physics',
    createdAt: iso(-1),
  },
  {
    id: 'task-3',
    title: 'Implement stack problems',
    description: 'Practice monotonic stack patterns.',
    status: 'todo',
    priority: 'medium',
    dueDate: iso(3),
    subjectId: 'sub-cs',
    createdAt: iso(-4),
  },
];

export const seedNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Derivative shortcuts',
    content:
      '## Chain rule\nUse outside derivative times inside derivative.\n\n- Watch signs\n- Simplify before substituting',
    tags: ['math', 'revision'],
    topicId: 'topic-derivatives',
    createdAt: iso(-3),
    updatedAt: iso(-1),
  },
  {
    id: 'note-2',
    title: 'Newton laws traps',
    content: 'Free body diagrams first. Resolve axes before writing equations.',
    tags: ['physics'],
    topicId: 'topic-newton',
    createdAt: iso(-2),
    updatedAt: iso(-2),
  },
];

export const seedSessions: StudySession[] = [
  {
    id: 'session-1',
    subjectId: 'sub-math',
    topicId: 'topic-derivatives',
    durationMinutes: 45,
    date: iso(-6),
    type: 'pomodoro',
  },
  {
    id: 'session-2',
    subjectId: 'sub-physics',
    topicId: 'topic-newton',
    durationMinutes: 30,
    date: iso(-5),
    type: 'revision',
  },
  {
    id: 'session-3',
    subjectId: 'sub-cs',
    topicId: 'topic-arrays',
    durationMinutes: 50,
    date: iso(-3),
    type: 'self_study',
  },
  {
    id: 'session-4',
    subjectId: 'sub-math',
    topicId: 'topic-bayes',
    durationMinutes: 35,
    date: iso(-1),
    type: 'flashcards',
  },
  {
    id: 'session-5',
    subjectId: 'sub-math',
    topicId: 'topic-integrals',
    durationMinutes: 25,
    date: iso(0),
    type: 'pomodoro',
  },
];

export const seedFlashcards: Flashcard[] = [
  {
    id: 'card-1',
    front: 'What does the chain rule compute?',
    back: 'The derivative of a composite function.',
    topicId: 'topic-derivatives',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    dueDate: iso(-1),
    createdAt: iso(-3),
  },
  {
    id: 'card-2',
    front: 'State Newton’s second law.',
    back: 'Net force equals mass times acceleration.',
    topicId: 'topic-newton',
    easeFactor: 2.5,
    interval: 3,
    repetitions: 1,
    dueDate: iso(0),
    createdAt: iso(-4),
  },
];

export const seedExams: Exam[] = [
  { id: 'exam-1', title: 'Calculus Unit Test', subjectId: 'sub-math', date: iso(6) },
  { id: 'exam-2', title: 'Physics Mechanics Quiz', subjectId: 'sub-physics', date: iso(10) },
];

export const seedSentinel: Resource[] = [
  {
    id: 'res-1',
    title: 'Calculus formula sheet',
    url: 'https://example.com/calculus',
    type: 'PDF',
    subjectId: 'sub-math',
  },
  {
    id: 'res-2',
    title: 'DSA pattern index',
    url: 'https://example.com/dsa',
    type: 'Link',
    subjectId: 'sub-cs',
  },
];

export const seedSettings: AthenaSettings = {
  dailyGoalMinutes: 90,
  pomodoroWorkDuration: 25,
  pomodoroShortBreak: 5,
  pomodoroLongBreak: 15,
  openRouterApiKey: '',
};

export const seedMessages: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: 'Ask me to turn your notes, tasks, or weak topics into a focused study plan.',
    createdAt: iso(0),
  },
];
