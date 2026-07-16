import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Enums for standard state fields
export const taskStatusEnum = pgEnum('task_status', ['todo', 'in_progress', 'done']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);
export const topicStatusEnum = pgEnum('topic_status', ['learning', 'reviewing', 'mastered']);
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);

// 1. Users table (Matches Supabase auth.users UUID)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Settings table
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  theme: varchar('theme', { length: 50 }).default('dark').notNull(),
  dailyGoalMinutes: integer('daily_goal_minutes').default(60).notNull(),
  pomodoroWorkDuration: integer('pomodoro_work_duration').default(25).notNull(),
  pomodoroShortBreak: integer('pomodoro_short_break').default(5).notNull(),
  pomodoroLongBreak: integer('pomodoro_long_break').default(15).notNull(),
  openRouterApiKey: text('openrouter_api_key').default('').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Subjects table
export const subjects = pgTable('subjects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  color: varchar('color', { length: 7 }).default('#4F46E5').notNull(), // Hex color
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Chapters table
export const chapters = pgTable('chapters', {
  id: uuid('id').primaryKey().defaultRandom(),
  subjectId: uuid('subject_id')
    .references(() => subjects.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  orderIndex: integer('order_index').default(0).notNull(),
});

// 5. Topics table
export const topics = pgTable('topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  chapterId: uuid('chapter_id')
    .references(() => chapters.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  status: topicStatusEnum('status').default('learning').notNull(),
  difficulty: difficultyEnum('difficulty').default('medium').notNull(),
  lastReviewedAt: timestamp('last_reviewed_at'),
  nextReviewDate: timestamp('next_review_date'),
});

// 6. Notes table
export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  topicId: uuid('topic_id').references(() => topics.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 7. Tasks table
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: taskStatusEnum('status').default('todo').notNull(),
  priority: priorityEnum('priority').default('medium').notNull(),
  dueDate: timestamp('due_date'),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 8. Study Sessions table
export const studySessions = pgTable('study_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'set null' }),
  topicId: uuid('topic_id').references(() => topics.id, { onDelete: 'set null' }),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  durationMinutes: integer('duration_minutes').default(0).notNull(),
  type: varchar('type', { length: 100 }).notNull(), // pomodoro, self_study, read
});

// 9. Pomodoro Sessions table
export const pomodoroSessions = pgTable('pomodoro_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  studySessionId: uuid('study_session_id').references(() => studySessions.id, {
    onDelete: 'set null',
  }),
  durationMinutes: integer('duration_minutes').notNull(),
  completed: boolean('completed').default(false).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // focus, short_break, long_break
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const flashcards = pgTable('flashcards', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  topicId: uuid('topic_id').references(() => topics.id, { onDelete: 'set null' }),
  front: text('front').notNull(),
  back: text('back').notNull(),
  easeFactor: integer('ease_factor').default(250).notNull(),
  interval: integer('interval').default(1).notNull(),
  repetitions: integer('repetitions').default(0).notNull(),
  dueDate: timestamp('due_date').defaultNow().notNull(),
  lastReviewedAt: timestamp('last_reviewed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const exams = pgTable('exams', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  subjectId: uuid('subject_id')
    .references(() => subjects.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  date: timestamp('date').notNull(),
});

export const resources = pgTable('resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  url: text('url').notNull(),
  type: varchar('type', { length: 100 }).default('Link').notNull(),
});

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  role: varchar('role', { length: 20 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
