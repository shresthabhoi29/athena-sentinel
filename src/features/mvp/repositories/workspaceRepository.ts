import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  chapters,
  chatMessages,
  exams,
  flashcards,
  notes,
  pomodoroSessions,
  resources,
  settings,
  studySessions,
  subjects,
  tasks,
  topics,
} from '@/lib/db/schema';
import {
  seedChapters,
  seedExams,
  seedFlashcards,
  seedMessages,
  seedNotes,
  seedResources,
  seedSessions,
  seedSettings,
  seedSubjects,
  seedTasks,
  seedTopics,
} from '../seed';
import type {
  AthenaSettings,
  Chapter,
  ChatMessage,
  Difficulty,
  Exam,
  Flashcard,
  Note,
  Resource,
  SessionType,
  StudySession,
  Subject,
  Task,
  Topic,
} from '../types';

export type WorkspaceSnapshot = {
  subjects: Subject[];
  chapters: Chapter[];
  topics: Topic[];
  notes: Note[];
  tasks: Task[];
  sessions: StudySession[];
  flashcards: Flashcard[];
  exams: Exam[];
  resources: Resource[];
  settings: AthenaSettings;
  chatMessages: ChatMessage[];
};

const toIso = (value: Date | null | undefined) => value?.toISOString();
const fromIso = (value?: string) => (value ? new Date(value) : null);

function id() {
  return crypto.randomUUID();
}

function mapSubject(row: typeof subjects.$inferSelect): Subject {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    description: row.description ?? '',
    createdAt: row.createdAt.toISOString(),
  };
}

function mapChapter(row: typeof chapters.$inferSelect): Chapter {
  return {
    id: row.id,
    subjectId: row.subjectId,
    name: row.name,
    orderIndex: row.orderIndex,
  };
}

function mapTopic(row: typeof topics.$inferSelect): Topic {
  return {
    id: row.id,
    chapterId: row.chapterId,
    name: row.name,
    status: row.status,
    difficulty: row.difficulty,
    lastReviewedAt: toIso(row.lastReviewedAt),
    nextReviewDate: toIso(row.nextReviewDate),
  };
}

function mapNote(row: typeof notes.$inferSelect): Note {
  return {
    id: row.id,
    topicId: row.topicId ?? undefined,
    title: row.title,
    content: row.content,
    tags: row.tags ?? [],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function mapTask(row: typeof tasks.$inferSelect): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    status: row.status,
    priority: row.priority,
    dueDate: toIso(row.dueDate),
    subjectId: row.subjectId ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

function mapSession(row: typeof studySessions.$inferSelect): StudySession {
  return {
    id: row.id,
    subjectId: row.subjectId ?? undefined,
    topicId: row.topicId ?? undefined,
    durationMinutes: row.durationMinutes,
    date: row.startTime.toISOString(),
    type: row.type as SessionType,
  };
}

function mapFlashcard(row: typeof flashcards.$inferSelect): Flashcard {
  return {
    id: row.id,
    front: row.front,
    back: row.back,
    topicId: row.topicId ?? undefined,
    easeFactor: row.easeFactor / 100,
    interval: row.interval,
    repetitions: row.repetitions,
    dueDate: row.dueDate.toISOString(),
    lastReviewedAt: toIso(row.lastReviewedAt),
    createdAt: row.createdAt.toISOString(),
  };
}

function mapExam(row: typeof exams.$inferSelect): Exam {
  return {
    id: row.id,
    title: row.title,
    subjectId: row.subjectId,
    date: row.date.toISOString(),
  };
}

function mapResource(row: typeof resources.$inferSelect): Resource {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    type: row.type,
    subjectId: row.subjectId ?? undefined,
  };
}

function mapSettings(row: typeof settings.$inferSelect | undefined): AthenaSettings {
  return {
    dailyGoalMinutes: row?.dailyGoalMinutes ?? seedSettings.dailyGoalMinutes,
    pomodoroWorkDuration: row?.pomodoroWorkDuration ?? seedSettings.pomodoroWorkDuration,
    pomodoroShortBreak: row?.pomodoroShortBreak ?? seedSettings.pomodoroShortBreak,
    pomodoroLongBreak: row?.pomodoroLongBreak ?? seedSettings.pomodoroLongBreak,
    openRouterApiKey: row?.openRouterApiKey ?? '',
  };
}

function mapChatMessage(row: typeof chatMessages.$inferSelect): ChatMessage {
  return {
    id: row.id,
    role: row.role === 'user' ? 'user' : 'assistant',
    content: row.content,
    createdAt: row.createdAt.toISOString(),
  };
}

async function seedWorkspaceIfNeeded(userId: string) {
  const existingSubjects = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(eq(subjects.userId, userId))
    .limit(1);

  if (existingSubjects.length > 0) {
    return;
  }

  await db.transaction(async (tx) => {
    const subjectIdMap = new Map<string, string>();
    const chapterIdMap = new Map<string, string>();
    const topicIdMap = new Map<string, string>();

    await tx
      .insert(settings)
      .values({
        userId,
        dailyGoalMinutes: seedSettings.dailyGoalMinutes,
        pomodoroWorkDuration: seedSettings.pomodoroWorkDuration,
        pomodoroShortBreak: seedSettings.pomodoroShortBreak,
        pomodoroLongBreak: seedSettings.pomodoroLongBreak,
        openRouterApiKey: '',
      })
      .onConflictDoNothing({ target: settings.userId });

    for (const subject of seedSubjects) {
      const newId = id();
      subjectIdMap.set(subject.id, newId);
      await tx.insert(subjects).values({
        id: newId,
        userId,
        name: subject.name,
        color: subject.color,
        description: subject.description,
      });
    }

    for (const chapter of seedChapters) {
      const subjectId = subjectIdMap.get(chapter.subjectId);
      if (!subjectId) continue;
      const newId = id();
      chapterIdMap.set(chapter.id, newId);
      await tx.insert(chapters).values({
        id: newId,
        subjectId,
        name: chapter.name,
        orderIndex: chapter.orderIndex,
      });
    }

    for (const topic of seedTopics) {
      const chapterId = chapterIdMap.get(topic.chapterId);
      if (!chapterId) continue;
      const newId = id();
      topicIdMap.set(topic.id, newId);
      await tx.insert(topics).values({
        id: newId,
        chapterId,
        name: topic.name,
        status: topic.status,
        difficulty: topic.difficulty,
        lastReviewedAt: fromIso(topic.lastReviewedAt),
        nextReviewDate: fromIso(topic.nextReviewDate),
      });
    }

    for (const note of seedNotes) {
      await tx.insert(notes).values({
        userId,
        topicId: note.topicId ? topicIdMap.get(note.topicId) : null,
        title: note.title,
        content: note.content,
        tags: note.tags,
      });
    }

    for (const task of seedTasks) {
      await tx.insert(tasks).values({
        userId,
        subjectId: task.subjectId ? subjectIdMap.get(task.subjectId) : null,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: fromIso(task.dueDate),
      });
    }

    for (const session of seedSessions) {
      await tx.insert(studySessions).values({
        userId,
        subjectId: session.subjectId ? subjectIdMap.get(session.subjectId) : null,
        topicId: session.topicId ? topicIdMap.get(session.topicId) : null,
        startTime: new Date(session.date),
        durationMinutes: session.durationMinutes,
        type: session.type,
      });
    }

    for (const card of seedFlashcards) {
      await tx.insert(flashcards).values({
        userId,
        topicId: card.topicId ? topicIdMap.get(card.topicId) : null,
        front: card.front,
        back: card.back,
        easeFactor: Math.round(card.easeFactor * 100),
        interval: card.interval,
        repetitions: card.repetitions,
        dueDate: new Date(card.dueDate),
        lastReviewedAt: fromIso(card.lastReviewedAt),
      });
    }

    for (const exam of seedExams) {
      const subjectId = subjectIdMap.get(exam.subjectId);
      if (!subjectId) continue;
      await tx.insert(exams).values({
        userId,
        subjectId,
        title: exam.title,
        date: new Date(exam.date),
      });
    }

    for (const resource of seedResources) {
      await tx.insert(resources).values({
        userId,
        subjectId: resource.subjectId ? subjectIdMap.get(resource.subjectId) : null,
        title: resource.title,
        url: resource.url,
        type: resource.type,
      });
    }

    for (const message of seedMessages) {
      await tx.insert(chatMessages).values({
        userId,
        role: message.role,
        content: message.content,
      });
    }
  });
}

export const workspaceRepository = {
  async getWorkspace(userId: string): Promise<WorkspaceSnapshot> {
    await seedWorkspaceIfNeeded(userId);

    const subjectRows = await db
      .select()
      .from(subjects)
      .where(eq(subjects.userId, userId))
      .orderBy(desc(subjects.createdAt));
    const subjectIds = subjectRows.map((subject) => subject.id);
    const chapterRows =
      subjectIds.length > 0
        ? await db
            .select()
            .from(chapters)
            .where(inArray(chapters.subjectId, subjectIds))
            .orderBy(asc(chapters.orderIndex))
        : [];
    const chapterIds = chapterRows.map((chapter) => chapter.id);
    const topicRows =
      chapterIds.length > 0
        ? await db.select().from(topics).where(inArray(topics.chapterId, chapterIds))
        : [];
    const [
      noteRows,
      taskRows,
      sessionRows,
      flashcardRows,
      examRows,
      resourceRows,
      settingsRows,
      chatRows,
    ] = await Promise.all([
      db.select().from(notes).where(eq(notes.userId, userId)).orderBy(desc(notes.updatedAt)),
      db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt)),
      db
        .select()
        .from(studySessions)
        .where(eq(studySessions.userId, userId))
        .orderBy(desc(studySessions.startTime)),
      db
        .select()
        .from(flashcards)
        .where(eq(flashcards.userId, userId))
        .orderBy(asc(flashcards.dueDate)),
      db.select().from(exams).where(eq(exams.userId, userId)).orderBy(asc(exams.date)),
      db.select().from(resources).where(eq(resources.userId, userId)),
      db.select().from(settings).where(eq(settings.userId, userId)).limit(1),
      db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.userId, userId))
        .orderBy(asc(chatMessages.createdAt)),
    ]);

    return {
      subjects: subjectRows.map(mapSubject),
      chapters: chapterRows.map(mapChapter),
      topics: topicRows.map(mapTopic),
      notes: noteRows.map(mapNote),
      tasks: taskRows.map(mapTask),
      sessions: sessionRows.map(mapSession),
      flashcards: flashcardRows.map(mapFlashcard),
      exams: examRows.map(mapExam),
      resources: resourceRows.map(mapResource),
      settings: mapSettings(settingsRows[0]),
      chatMessages: chatRows.map(mapChatMessage),
    };
  },

  async addSubject(userId: string, input: Pick<Subject, 'name' | 'color' | 'description'>) {
    await db.insert(subjects).values({ userId, ...input });
  },

  async updateSubject(id: string, input: Partial<Pick<Subject, 'name' | 'color' | 'description'>>) {
    await db.update(subjects).set(input).where(eq(subjects.id, id));
  },

  async deleteSubject(id: string) {
    await db.delete(subjects).where(eq(subjects.id, id));
  },

  async addChapter(subjectId: string, name: string) {
    const siblingRows = await db.select().from(chapters).where(eq(chapters.subjectId, subjectId));
    await db.insert(chapters).values({ subjectId, name, orderIndex: siblingRows.length + 1 });
  },

  async updateChapter(id: string, name: string) {
    await db.update(chapters).set({ name }).where(eq(chapters.id, id));
  },

  async deleteChapter(id: string) {
    await db.delete(chapters).where(eq(chapters.id, id));
  },

  async addTopic(chapterId: string, input: { name: string; difficulty: Difficulty }) {
    await db.insert(topics).values({
      chapterId,
      name: input.name,
      difficulty: input.difficulty,
      status: 'learning',
      nextReviewDate: new Date(),
    });
  },

  async updateTopic(
    id: string,
    input: Partial<Pick<Topic, 'name' | 'difficulty' | 'status' | 'nextReviewDate'>>,
  ) {
    await db
      .update(topics)
      .set({
        name: input.name,
        difficulty: input.difficulty,
        status: input.status,
        nextReviewDate: fromIso(input.nextReviewDate),
      })
      .where(eq(topics.id, id));
  },

  async deleteTopic(id: string) {
    await db.delete(topics).where(eq(topics.id, id));
  },

  async addNote(userId: string, input: Pick<Note, 'title' | 'content' | 'tags' | 'topicId'>) {
    const [row] = await db
      .insert(notes)
      .values({
        userId,
        topicId: input.topicId || null,
        title: input.title,
        content: input.content,
        tags: input.tags,
      })
      .returning({ id: notes.id });
    return row.id;
  },

  async updateNote(
    id: string,
    input: Partial<Pick<Note, 'title' | 'content' | 'tags' | 'topicId'>>,
  ) {
    await db
      .update(notes)
      .set({
        title: input.title,
        content: input.content,
        tags: input.tags,
        topicId: input.topicId || null,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, id));
  },

  async deleteNote(id: string) {
    await db.delete(notes).where(eq(notes.id, id));
  },

  async addTask(
    userId: string,
    input: Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'subjectId'>,
  ) {
    await db.insert(tasks).values({
      userId,
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueDate: fromIso(input.dueDate),
      subjectId: input.subjectId || null,
    });
  },

  async updateTask(
    id: string,
    input: Partial<
      Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'subjectId' | 'status'>
    >,
  ) {
    await db
      .update(tasks)
      .set({
        title: input.title,
        description: input.description,
        priority: input.priority,
        dueDate: fromIso(input.dueDate),
        subjectId: input.subjectId || null,
        status: input.status,
      })
      .where(eq(tasks.id, id));
  },

  async deleteTask(id: string) {
    await db.delete(tasks).where(eq(tasks.id, id));
  },

  async addSession(userId: string, input: Omit<StudySession, 'id'>) {
    const [session] = await db
      .insert(studySessions)
      .values({
        userId,
        subjectId: input.subjectId || null,
        topicId: input.topicId || null,
        startTime: new Date(input.date),
        durationMinutes: input.durationMinutes,
        type: input.type,
      })
      .returning({ id: studySessions.id });

    if (input.type === 'pomodoro') {
      await db.insert(pomodoroSessions).values({
        userId,
        studySessionId: session.id,
        durationMinutes: input.durationMinutes,
        completed: true,
        type: 'focus',
      });
    }
  },

  async addFlashcard(userId: string, input: Pick<Flashcard, 'front' | 'back' | 'topicId'>) {
    await db.insert(flashcards).values({
      userId,
      topicId: input.topicId || null,
      front: input.front,
      back: input.back,
    });
  },

  async updateFlashcard(id: string, input: Partial<Pick<Flashcard, 'front' | 'back' | 'topicId'>>) {
    await db
      .update(flashcards)
      .set({
        front: input.front,
        back: input.back,
        topicId: input.topicId || null,
      })
      .where(eq(flashcards.id, id));
  },

  async deleteFlashcard(id: string) {
    await db.delete(flashcards).where(eq(flashcards.id, id));
  },

  async reviewFlashcard(userId: string, id: string, quality: number) {
    const [card] = await db.select().from(flashcards).where(eq(flashcards.id, id)).limit(1);
    if (!card) return;

    const boundedQuality = Math.max(0, Math.min(5, quality));
    let repetitions = card.repetitions;
    let interval = card.interval;
    let easeFactor = card.easeFactor / 100;

    if (boundedQuality < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      repetitions += 1;
      interval = repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.round(interval * easeFactor);
      easeFactor = Math.max(
        1.3,
        easeFactor + (0.1 - (5 - boundedQuality) * (0.08 + (5 - boundedQuality) * 0.02)),
      );
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + interval);
    await db
      .update(flashcards)
      .set({
        repetitions,
        interval,
        easeFactor: Math.round(easeFactor * 100),
        dueDate,
        lastReviewedAt: new Date(),
      })
      .where(eq(flashcards.id, id));
    await this.addSession(userId, {
      durationMinutes: 5,
      date: new Date().toISOString(),
      type: 'flashcards',
    });
  },

  async addResource(userId: string, input: Pick<Resource, 'title' | 'url' | 'type' | 'subjectId'>) {
    await db.insert(resources).values({
      userId,
      title: input.title,
      url: input.url,
      type: input.type,
      subjectId: input.subjectId || null,
    });
  },

  async updateSettings(userId: string, input: Partial<AthenaSettings>) {
    await db
      .update(settings)
      .set({
        dailyGoalMinutes: input.dailyGoalMinutes,
        pomodoroWorkDuration: input.pomodoroWorkDuration,
        pomodoroShortBreak: input.pomodoroShortBreak,
        pomodoroLongBreak: input.pomodoroLongBreak,
        openRouterApiKey: input.openRouterApiKey,
        updatedAt: new Date(),
      })
      .where(eq(settings.userId, userId));
  },

  async addChatMessage(userId: string, input: Pick<ChatMessage, 'role' | 'content'>) {
    await db.insert(chatMessages).values({
      userId,
      role: input.role,
      content: input.content,
    });
  },

  async clearChat(userId: string) {
    await db
      .delete(chatMessages)
      .where(and(eq(chatMessages.userId, userId), eq(chatMessages.role, 'user')));
    await db
      .delete(chatMessages)
      .where(and(eq(chatMessages.userId, userId), eq(chatMessages.role, 'assistant')));
    for (const message of seedMessages) {
      await db.insert(chatMessages).values({
        userId,
        role: message.role,
        content: message.content,
      });
    }
  },
};
