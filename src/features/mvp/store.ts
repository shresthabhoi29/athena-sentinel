'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addChapterAction,
  addChatMessageAction,
  addFlashcardAction,
  addNoteAction,
  addResourceAction,
  addSessionAction,
  addSubjectAction,
  addTaskAction,
  addTopicAction,
  clearChatAction,
  deleteChapterAction,
  deleteFlashcardAction,
  deleteNoteAction,
  deleteSubjectAction,
  deleteTaskAction,
  deleteTopicAction,
  getWorkspaceAction,
  reviewFlashcardAction,
  updateChapterAction,
  updateFlashcardAction,
  updateNoteAction,
  updateSettingsAction,
  updateSubjectAction,
  updateTaskAction,
  updateTopicAction,
} from './actions/workspaceActions';
import {
  seedChapters,
  seedExams,
  seedFlashcards,
  seedMessages,
  seedNotes,
  seedSentinel,
  seedSessions,
  seedSettings,
  seedSubjects,
  seedTasks,
  seedTopics,
} from './seed';
import type { WorkspaceSnapshot } from './repositories/workspaceRepository';
import type {
  AthenaSettings,
  ChatMessage,
  Difficulty,
  Exam,
  Flashcard,
  Note,
  Resource,
  StudySession,
  Subject,
  Task,
  Topic,
} from './types';

const workspaceKey = ['workspace'] as const;

const fallbackWorkspace: WorkspaceSnapshot = {
  subjects: seedSubjects,
  chapters: seedChapters,
  topics: seedTopics,
  notes: seedNotes,
  tasks: seedTasks,
  sessions: seedSessions,
  flashcards: seedFlashcards,
  exams: seedExams,
  Sentinel: seedSentinel,
  settings: seedSettings,
  chatMessages: seedMessages,
};

const tempId = (prefix: string) =>
  `${prefix}-optimistic-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function updateCard(card: Flashcard, quality: number): Flashcard {
  const boundedQuality = Math.max(0, Math.min(5, quality));
  let repetitions = card.repetitions;
  let interval = card.interval;
  let easeFactor = card.easeFactor;

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

  return {
    ...card,
    repetitions,
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    dueDate: dueDate.toISOString(),
    lastReviewedAt: new Date().toISOString(),
  };
}

function useWorkspaceMutation<TVariables>({
  mutationFn,
  optimisticUpdate,
}: {
  mutationFn: (variables: TVariables) => Promise<unknown>;
  optimisticUpdate: (snapshot: WorkspaceSnapshot, variables: TVariables) => WorkspaceSnapshot;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: workspaceKey });
      const previous = queryClient.getQueryData<WorkspaceSnapshot>(workspaceKey);
      queryClient.setQueryData<WorkspaceSnapshot>(workspaceKey, (current) =>
        optimisticUpdate(current ?? fallbackWorkspace, variables),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(workspaceKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceKey });
    },
  });
}

export function useWorkspaceStore() {
  const query = useQuery({
    queryKey: workspaceKey,
    queryFn: getWorkspaceAction,
    staleTime: 30_000,
    retry: 1,
  });

  const addSubjectMutation = useWorkspaceMutation<Pick<Subject, 'name' | 'color' | 'description'>>({
    mutationFn: addSubjectAction,
    optimisticUpdate: (snapshot, input) => ({
      ...snapshot,
      subjects: [
        { id: tempId('sub'), createdAt: new Date().toISOString(), ...input },
        ...snapshot.subjects,
      ],
    }),
  });
  const updateSubjectMutation = useWorkspaceMutation<{
    id: string;
    input: Partial<Pick<Subject, 'name' | 'color' | 'description'>>;
  }>({
    mutationFn: ({ id, input }) => updateSubjectAction(id, input),
    optimisticUpdate: (snapshot, variables) => ({
      ...snapshot,
      subjects: snapshot.subjects.map((subject) =>
        subject.id === variables.id ? { ...subject, ...variables.input } : subject,
      ),
    }),
  });
  const deleteSubjectMutation = useWorkspaceMutation<string>({
    mutationFn: deleteSubjectAction,
    optimisticUpdate: (snapshot, id) => ({
      ...snapshot,
      subjects: snapshot.subjects.filter((subject) => subject.id !== id),
    }),
  });
  const addChapterMutation = useWorkspaceMutation<{ subjectId: string; name: string }>({
    mutationFn: ({ subjectId, name }) => addChapterAction(subjectId, name),
    optimisticUpdate: (snapshot, variables) => ({
      ...snapshot,
      chapters: [
        ...snapshot.chapters,
        {
          id: tempId('chap'),
          subjectId: variables.subjectId,
          name: variables.name,
          orderIndex:
            snapshot.chapters.filter((chapter) => chapter.subjectId === variables.subjectId)
              .length + 1,
        },
      ],
    }),
  });
  const updateChapterMutation = useWorkspaceMutation<{ id: string; name: string }>({
    mutationFn: ({ id, name }) => updateChapterAction(id, name),
    optimisticUpdate: (snapshot, variables) => ({
      ...snapshot,
      chapters: snapshot.chapters.map((chapter) =>
        chapter.id === variables.id ? { ...chapter, name: variables.name } : chapter,
      ),
    }),
  });
  const deleteChapterMutation = useWorkspaceMutation<string>({
    mutationFn: deleteChapterAction,
    optimisticUpdate: (snapshot, id) => ({
      ...snapshot,
      chapters: snapshot.chapters.filter((chapter) => chapter.id !== id),
    }),
  });
  const addTopicMutation = useWorkspaceMutation<{
    chapterId: string;
    input: { name: string; difficulty: Difficulty };
  }>({
    mutationFn: ({ chapterId, input }) => addTopicAction(chapterId, input),
    optimisticUpdate: (snapshot, variables) => ({
      ...snapshot,
      topics: [
        ...snapshot.topics,
        {
          id: tempId('topic'),
          chapterId: variables.chapterId,
          name: variables.input.name,
          difficulty: variables.input.difficulty,
          status: 'learning',
          nextReviewDate: new Date().toISOString(),
        },
      ],
    }),
  });
  const updateTopicMutation = useWorkspaceMutation<{
    id: string;
    input: Partial<Pick<Topic, 'name' | 'difficulty' | 'status' | 'nextReviewDate'>>;
  }>({
    mutationFn: ({ id, input }) => updateTopicAction(id, input),
    optimisticUpdate: (snapshot, variables) => ({
      ...snapshot,
      topics: snapshot.topics.map((topic) =>
        topic.id === variables.id ? { ...topic, ...variables.input } : topic,
      ),
    }),
  });
  const deleteTopicMutation = useWorkspaceMutation<string>({
    mutationFn: deleteTopicAction,
    optimisticUpdate: (snapshot, id) => ({
      ...snapshot,
      topics: snapshot.topics.filter((topic) => topic.id !== id),
    }),
  });
  const addNoteMutation = useWorkspaceMutation<
    Pick<Note, 'title' | 'content' | 'tags' | 'topicId'> & { id: string }
  >({
    mutationFn: (variables) =>
      addNoteAction({
        title: variables.title,
        content: variables.content,
        tags: variables.tags,
        topicId: variables.topicId,
      }),
    optimisticUpdate: (snapshot, input) => ({
      ...snapshot,
      notes: [
        {
          id: input.id,
          title: input.title,
          content: input.content,
          tags: input.tags,
          topicId: input.topicId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...snapshot.notes,
      ],
    }),
  });
  const updateNoteMutation = useWorkspaceMutation<{
    id: string;
    input: Partial<Pick<Note, 'title' | 'content' | 'tags' | 'topicId'>>;
  }>({
    mutationFn: ({ id, input }) => updateNoteAction(id, input),
    optimisticUpdate: (snapshot, variables) => ({
      ...snapshot,
      notes: snapshot.notes.map((note) =>
        note.id === variables.id
          ? { ...note, ...variables.input, updatedAt: new Date().toISOString() }
          : note,
      ),
    }),
  });
  const deleteNoteMutation = useWorkspaceMutation<string>({
    mutationFn: deleteNoteAction,
    optimisticUpdate: (snapshot, id) => ({
      ...snapshot,
      notes: snapshot.notes.filter((note) => note.id !== id),
    }),
  });
  const addTaskMutation = useWorkspaceMutation<
    Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'subjectId'>
  >({
    mutationFn: addTaskAction,
    optimisticUpdate: (snapshot, input) => ({
      ...snapshot,
      tasks: [
        {
          id: tempId('task'),
          status: 'todo',
          createdAt: new Date().toISOString(),
          ...input,
        },
        ...snapshot.tasks,
      ],
    }),
  });
  const updateTaskMutation = useWorkspaceMutation<{
    id: string;
    input: Partial<
      Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'subjectId' | 'status'>
    >;
  }>({
    mutationFn: ({ id, input }) => updateTaskAction(id, input),
    optimisticUpdate: (snapshot, variables) => ({
      ...snapshot,
      tasks: snapshot.tasks.map((task) =>
        task.id === variables.id ? { ...task, ...variables.input } : task,
      ),
    }),
  });
  const deleteTaskMutation = useWorkspaceMutation<string>({
    mutationFn: deleteTaskAction,
    optimisticUpdate: (snapshot, id) => ({
      ...snapshot,
      tasks: snapshot.tasks.filter((task) => task.id !== id),
    }),
  });
  const addSessionMutation = useWorkspaceMutation<Omit<StudySession, 'id'>>({
    mutationFn: addSessionAction,
    optimisticUpdate: (snapshot, input) => ({
      ...snapshot,
      sessions: [{ id: tempId('session'), ...input }, ...snapshot.sessions],
    }),
  });
  const addFlashcardMutation = useWorkspaceMutation<Pick<Flashcard, 'front' | 'back' | 'topicId'>>({
    mutationFn: addFlashcardAction,
    optimisticUpdate: (snapshot, input) => ({
      ...snapshot,
      flashcards: [
        {
          id: tempId('card'),
          front: input.front,
          back: input.back,
          topicId: input.topicId,
          easeFactor: 2.5,
          interval: 1,
          repetitions: 0,
          dueDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        ...snapshot.flashcards,
      ],
    }),
  });
  const updateFlashcardMutation = useWorkspaceMutation<{
    id: string;
    input: Partial<Pick<Flashcard, 'front' | 'back' | 'topicId'>>;
  }>({
    mutationFn: ({ id, input }) => updateFlashcardAction(id, input),
    optimisticUpdate: (snapshot, variables) => ({
      ...snapshot,
      flashcards: snapshot.flashcards.map((card) =>
        card.id === variables.id ? { ...card, ...variables.input } : card,
      ),
    }),
  });
  const deleteFlashcardMutation = useWorkspaceMutation<string>({
    mutationFn: deleteFlashcardAction,
    optimisticUpdate: (snapshot, id) => ({
      ...snapshot,
      flashcards: snapshot.flashcards.filter((card) => card.id !== id),
    }),
  });
  const reviewFlashcardMutation = useWorkspaceMutation<{ id: string; quality: number }>({
    mutationFn: ({ id, quality }) => reviewFlashcardAction(id, quality),
    optimisticUpdate: (snapshot, variables) => ({
      ...snapshot,
      flashcards: snapshot.flashcards.map((card) =>
        card.id === variables.id ? updateCard(card, variables.quality) : card,
      ),
      sessions: [
        {
          id: tempId('session'),
          durationMinutes: 5,
          date: new Date().toISOString(),
          type: 'flashcards',
        },
        ...snapshot.sessions,
      ],
    }),
  });
  const addResourceMutation = useWorkspaceMutation<
    Pick<Resource, 'title' | 'url' | 'type' | 'subjectId'>
  >({
    mutationFn: addResourceAction,
    optimisticUpdate: (snapshot, input) => ({
      ...snapshot,
      Sentinel: [{ id: tempId('res'), ...input }, ...snapshot.Sentinel],
    }),
  });
  const updateSettingsMutation = useWorkspaceMutation<Partial<AthenaSettings>>({
    mutationFn: updateSettingsAction,
    optimisticUpdate: (snapshot, input) => ({
      ...snapshot,
      settings: {
        ...snapshot.settings,
        ...input,
      },
    }),
  });
  const addChatMessageMutation = useWorkspaceMutation<Pick<ChatMessage, 'role' | 'content'>>({
    mutationFn: addChatMessageAction,
    optimisticUpdate: (snapshot, input) => ({
      ...snapshot,
      chatMessages: [
        ...snapshot.chatMessages,
        { id: tempId('msg'), createdAt: new Date().toISOString(), ...input },
      ],
    }),
  });
  const clearChatMutation = useWorkspaceMutation<void>({
    mutationFn: () => clearChatAction(),
    optimisticUpdate: (snapshot) => ({
      ...snapshot,
      chatMessages: seedMessages,
    }),
  });

  const workspace = query.data ?? fallbackWorkspace;

  return {
    ...workspace,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    addSubject: (input: Pick<Subject, 'name' | 'color' | 'description'>) =>
      addSubjectMutation.mutate(input),
    updateSubject: (id: string, input: Partial<Pick<Subject, 'name' | 'color' | 'description'>>) =>
      updateSubjectMutation.mutate({ id, input }),
    deleteSubject: (id: string) => deleteSubjectMutation.mutate(id),
    addChapter: (subjectId: string, name: string) => addChapterMutation.mutate({ subjectId, name }),
    updateChapter: (id: string, name: string) => updateChapterMutation.mutate({ id, name }),
    deleteChapter: (id: string) => deleteChapterMutation.mutate(id),
    addTopic: (chapterId: string, input: { name: string; difficulty: Difficulty }) =>
      addTopicMutation.mutate({ chapterId, input }),
    updateTopic: (
      id: string,
      input: Partial<Pick<Topic, 'name' | 'difficulty' | 'status' | 'nextReviewDate'>>,
    ) => updateTopicMutation.mutate({ id, input }),
    deleteTopic: (id: string) => deleteTopicMutation.mutate(id),
    addNote: (input: Pick<Note, 'title' | 'content' | 'tags' | 'topicId'>) => {
      const id = tempId('note');
      addNoteMutation.mutate({ ...input, id });
      return id;
    },
    updateNote: (
      id: string,
      input: Partial<Pick<Note, 'title' | 'content' | 'tags' | 'topicId'>>,
    ) => updateNoteMutation.mutate({ id, input }),
    deleteNote: (id: string) => deleteNoteMutation.mutate(id),
    addTask: (input: Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'subjectId'>) =>
      addTaskMutation.mutate(input),
    updateTask: (
      id: string,
      input: Partial<
        Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'subjectId' | 'status'>
      >,
    ) => updateTaskMutation.mutate({ id, input }),
    deleteTask: (id: string) => deleteTaskMutation.mutate(id),
    addSession: (input: Omit<StudySession, 'id'>) => addSessionMutation.mutate(input),
    addFlashcard: (input: Pick<Flashcard, 'front' | 'back' | 'topicId'>) =>
      addFlashcardMutation.mutate(input),
    updateFlashcard: (id: string, input: Partial<Pick<Flashcard, 'front' | 'back' | 'topicId'>>) =>
      updateFlashcardMutation.mutate({ id, input }),
    deleteFlashcard: (id: string) => deleteFlashcardMutation.mutate(id),
    reviewFlashcard: (id: string, quality: number) =>
      reviewFlashcardMutation.mutate({ id, quality }),
    addExam: (input: Pick<Exam, 'title' | 'subjectId' | 'date'>) => {
      void input;
    },
    addResource: (input: Pick<Resource, 'title' | 'url' | 'type' | 'subjectId'>) =>
      addResourceMutation.mutate(input),
    updateSettings: (input: Partial<AthenaSettings>) => updateSettingsMutation.mutate(input),
    addChatMessage: (input: Pick<ChatMessage, 'role' | 'content'>) =>
      addChatMessageMutation.mutate(input),
    clearChat: () => clearChatMutation.mutate(),
  };
}
