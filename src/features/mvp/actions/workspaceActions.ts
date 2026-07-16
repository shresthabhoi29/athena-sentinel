'use server';

import { getCurrentWorkspaceUserId } from '../repositories/currentUser';
import { workspaceRepository, type WorkspaceSnapshot } from '../repositories/workspaceRepository';
import type {
  AthenaSettings,
  ChatMessage,
  Difficulty,
  Flashcard,
  Note,
  Resource,
  StudySession,
  Subject,
  Task,
  Topic,
} from '../types';

async function userId() {
  return getCurrentWorkspaceUserId();
}

export async function getWorkspaceAction(): Promise<WorkspaceSnapshot> {
  return workspaceRepository.getWorkspace(await userId());
}

export async function addSubjectAction(input: Pick<Subject, 'name' | 'color' | 'description'>) {
  await workspaceRepository.addSubject(await userId(), input);
}

export async function updateSubjectAction(
  id: string,
  input: Partial<Pick<Subject, 'name' | 'color' | 'description'>>,
) {
  await workspaceRepository.updateSubject(id, input);
}

export async function deleteSubjectAction(id: string) {
  await workspaceRepository.deleteSubject(id);
}

export async function addChapterAction(subjectId: string, name: string) {
  await workspaceRepository.addChapter(subjectId, name);
}

export async function updateChapterAction(id: string, name: string) {
  await workspaceRepository.updateChapter(id, name);
}

export async function deleteChapterAction(id: string) {
  await workspaceRepository.deleteChapter(id);
}

export async function addTopicAction(
  chapterId: string,
  input: { name: string; difficulty: Difficulty },
) {
  await workspaceRepository.addTopic(chapterId, input);
}

export async function updateTopicAction(
  id: string,
  input: Partial<Pick<Topic, 'name' | 'difficulty' | 'status' | 'nextReviewDate'>>,
) {
  await workspaceRepository.updateTopic(id, input);
}

export async function deleteTopicAction(id: string) {
  await workspaceRepository.deleteTopic(id);
}

export async function addNoteAction(input: Pick<Note, 'title' | 'content' | 'tags' | 'topicId'>) {
  return workspaceRepository.addNote(await userId(), input);
}

export async function updateNoteAction(
  id: string,
  input: Partial<Pick<Note, 'title' | 'content' | 'tags' | 'topicId'>>,
) {
  await workspaceRepository.updateNote(id, input);
}

export async function deleteNoteAction(id: string) {
  await workspaceRepository.deleteNote(id);
}

export async function addTaskAction(
  input: Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'subjectId'>,
) {
  await workspaceRepository.addTask(await userId(), input);
}

export async function updateTaskAction(
  id: string,
  input: Partial<
    Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'subjectId' | 'status'>
  >,
) {
  await workspaceRepository.updateTask(id, input);
}

export async function deleteTaskAction(id: string) {
  await workspaceRepository.deleteTask(id);
}

export async function addSessionAction(input: Omit<StudySession, 'id'>) {
  await workspaceRepository.addSession(await userId(), input);
}

export async function addFlashcardAction(input: Pick<Flashcard, 'front' | 'back' | 'topicId'>) {
  await workspaceRepository.addFlashcard(await userId(), input);
}

export async function updateFlashcardAction(
  id: string,
  input: Partial<Pick<Flashcard, 'front' | 'back' | 'topicId'>>,
) {
  await workspaceRepository.updateFlashcard(id, input);
}

export async function deleteFlashcardAction(id: string) {
  await workspaceRepository.deleteFlashcard(id);
}

export async function reviewFlashcardAction(id: string, quality: number) {
  await workspaceRepository.reviewFlashcard(await userId(), id, quality);
}

export async function addResourceAction(
  input: Pick<Resource, 'title' | 'url' | 'type' | 'subjectId'>,
) {
  await workspaceRepository.addResource(await userId(), input);
}

export async function updateSettingsAction(input: Partial<AthenaSettings>) {
  await workspaceRepository.updateSettings(await userId(), input);
}

export async function addChatMessageAction(input: Pick<ChatMessage, 'role' | 'content'>) {
  await workspaceRepository.addChatMessage(await userId(), input);
}

export async function clearChatAction() {
  await workspaceRepository.clearChat(await userId());
}
