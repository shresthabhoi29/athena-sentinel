'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
} from './seed';
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
} from './types';

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

type WorkspaceState = {
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
  addSubject: (input: Pick<Subject, 'name' | 'color' | 'description'>) => void;
  updateSubject: (
    id: string,
    input: Partial<Pick<Subject, 'name' | 'color' | 'description'>>,
  ) => void;
  deleteSubject: (id: string) => void;
  addChapter: (subjectId: string, name: string) => void;
  updateChapter: (id: string, name: string) => void;
  deleteChapter: (id: string) => void;
  addTopic: (chapterId: string, input: { name: string; difficulty: Difficulty }) => void;
  updateTopic: (
    id: string,
    input: Partial<Pick<Topic, 'name' | 'difficulty' | 'status' | 'nextReviewDate'>>,
  ) => void;
  deleteTopic: (id: string) => void;
  addNote: (input: Pick<Note, 'title' | 'content' | 'tags' | 'topicId'>) => string;
  updateNote: (
    id: string,
    input: Partial<Pick<Note, 'title' | 'content' | 'tags' | 'topicId'>>,
  ) => void;
  deleteNote: (id: string) => void;
  addTask: (
    input: Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'subjectId'>,
  ) => void;
  updateTask: (
    id: string,
    input: Partial<
      Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'subjectId' | 'status'>
    >,
  ) => void;
  deleteTask: (id: string) => void;
  addSession: (input: Omit<StudySession, 'id'>) => void;
  addFlashcard: (input: Pick<Flashcard, 'front' | 'back' | 'topicId'>) => void;
  updateFlashcard: (
    id: string,
    input: Partial<Pick<Flashcard, 'front' | 'back' | 'topicId'>>,
  ) => void;
  deleteFlashcard: (id: string) => void;
  reviewFlashcard: (id: string, quality: number) => void;
  addExam: (input: Pick<Exam, 'title' | 'subjectId' | 'date'>) => void;
  addResource: (input: Pick<Resource, 'title' | 'url' | 'type' | 'subjectId'>) => void;
  updateSettings: (input: Partial<AthenaSettings>) => void;
  addChatMessage: (input: Pick<ChatMessage, 'role' | 'content'>) => void;
  clearChat: () => void;
};

function nextReviewDate(interval: number) {
  const date = new Date();
  date.setDate(date.getDate() + interval);
  return date.toISOString();
}

function sm2(card: Flashcard, quality: number) {
  const boundedQuality = Math.max(0, Math.min(5, quality));
  let repetitions = card.repetitions;
  let interval = card.interval;
  let easeFactor = card.easeFactor;

  if (boundedQuality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - boundedQuality) * (0.08 + (5 - boundedQuality) * 0.02)),
    );
  }

  return {
    repetitions,
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    dueDate: nextReviewDate(interval),
    lastReviewedAt: new Date().toISOString(),
  };
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      subjects: seedSubjects,
      chapters: seedChapters,
      topics: seedTopics,
      notes: seedNotes,
      tasks: seedTasks,
      sessions: seedSessions,
      flashcards: seedFlashcards,
      exams: seedExams,
      resources: seedResources,
      settings: seedSettings,
      chatMessages: seedMessages,
      addSubject: (input) =>
        set((state) => ({
          subjects: [
            {
              id: createId('sub'),
              createdAt: new Date().toISOString(),
              ...input,
            },
            ...state.subjects,
          ],
        })),
      updateSubject: (id, input) =>
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id ? { ...subject, ...input } : subject,
          ),
        })),
      deleteSubject: (id) =>
        set((state) => {
          const chapterIds = state.chapters
            .filter((chapter) => chapter.subjectId === id)
            .map((chapter) => chapter.id);
          const topicIds = state.topics
            .filter((topic) => chapterIds.includes(topic.chapterId))
            .map((topic) => topic.id);

          return {
            subjects: state.subjects.filter((subject) => subject.id !== id),
            chapters: state.chapters.filter((chapter) => chapter.subjectId !== id),
            topics: state.topics.filter((topic) => !topicIds.includes(topic.id)),
            notes: state.notes.filter((note) => !note.topicId || !topicIds.includes(note.topicId)),
            tasks: state.tasks.filter((task) => task.subjectId !== id),
            flashcards: state.flashcards.filter(
              (flashcard) => !flashcard.topicId || !topicIds.includes(flashcard.topicId),
            ),
          };
        }),
      addChapter: (subjectId, name) =>
        set((state) => ({
          chapters: [
            ...state.chapters,
            {
              id: createId('chap'),
              subjectId,
              name,
              orderIndex:
                state.chapters.filter((chapter) => chapter.subjectId === subjectId).length + 1,
            },
          ],
        })),
      updateChapter: (id, name) =>
        set((state) => ({
          chapters: state.chapters.map((chapter) =>
            chapter.id === id ? { ...chapter, name } : chapter,
          ),
        })),
      deleteChapter: (id) =>
        set((state) => {
          const topicIds = state.topics
            .filter((topic) => topic.chapterId === id)
            .map((topic) => topic.id);

          return {
            chapters: state.chapters.filter((chapter) => chapter.id !== id),
            topics: state.topics.filter((topic) => topic.chapterId !== id),
            notes: state.notes.filter((note) => !note.topicId || !topicIds.includes(note.topicId)),
            flashcards: state.flashcards.filter(
              (flashcard) => !flashcard.topicId || !topicIds.includes(flashcard.topicId),
            ),
          };
        }),
      addTopic: (chapterId, input) =>
        set((state) => ({
          topics: [
            ...state.topics,
            {
              id: createId('topic'),
              chapterId,
              name: input.name,
              difficulty: input.difficulty,
              status: 'learning',
              nextReviewDate: new Date().toISOString(),
            },
          ],
        })),
      updateTopic: (id, input) =>
        set((state) => ({
          topics: state.topics.map((topic) => (topic.id === id ? { ...topic, ...input } : topic)),
        })),
      deleteTopic: (id) =>
        set((state) => ({
          topics: state.topics.filter((topic) => topic.id !== id),
          notes: state.notes.filter((note) => note.topicId !== id),
          flashcards: state.flashcards.filter((flashcard) => flashcard.topicId !== id),
        })),
      addNote: (input) => {
        const id = createId('note');
        set((state) => ({
          notes: [
            {
              id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...input,
            },
            ...state.notes,
          ],
        }));
        return id;
      },
      updateNote: (id, input) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...input, updatedAt: new Date().toISOString() } : note,
          ),
        })),
      deleteNote: (id) => set((state) => ({ notes: state.notes.filter((note) => note.id !== id) })),
      addTask: (input) =>
        set((state) => ({
          tasks: [
            {
              id: createId('task'),
              status: 'todo',
              createdAt: new Date().toISOString(),
              ...input,
            },
            ...state.tasks,
          ],
        })),
      updateTask: (id, input) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...input } : task)),
        })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
      addSession: (input) =>
        set((state) => ({
          sessions: [{ id: createId('session'), ...input }, ...state.sessions],
        })),
      addFlashcard: (input) =>
        set((state) => ({
          flashcards: [
            {
              id: createId('card'),
              easeFactor: 2.5,
              interval: 1,
              repetitions: 0,
              dueDate: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              ...input,
            },
            ...state.flashcards,
          ],
        })),
      updateFlashcard: (id, input) =>
        set((state) => ({
          flashcards: state.flashcards.map((flashcard) =>
            flashcard.id === id ? { ...flashcard, ...input } : flashcard,
          ),
        })),
      deleteFlashcard: (id) =>
        set((state) => ({
          flashcards: state.flashcards.filter((flashcard) => flashcard.id !== id),
        })),
      reviewFlashcard: (id, quality) =>
        set((state) => ({
          flashcards: state.flashcards.map((flashcard) =>
            flashcard.id === id ? { ...flashcard, ...sm2(flashcard, quality) } : flashcard,
          ),
          sessions: [
            {
              id: createId('session'),
              durationMinutes: 5,
              date: new Date().toISOString(),
              type: 'flashcards' as SessionType,
            },
            ...state.sessions,
          ],
        })),
      addExam: (input) =>
        set((state) => ({ exams: [{ id: createId('exam'), ...input }, ...state.exams] })),
      addResource: (input) =>
        set((state) => ({ resources: [{ id: createId('res'), ...input }, ...state.resources] })),
      updateSettings: (input) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...input,
          },
        })),
      addChatMessage: (input) =>
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              id: createId('msg'),
              createdAt: new Date().toISOString(),
              ...input,
            },
          ],
        })),
      clearChat: () => set({ chatMessages: seedMessages }),
    }),
    {
      name: 'athena-os-mvp',
      version: 1,
    },
  ),
);
