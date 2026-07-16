'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressBar, SectionHeader, SurfaceCard } from '../components/Cards';
import { useWorkspaceStore } from '../store';
import { subjectProgress } from '../utils';
import type { Difficulty, TopicStatus } from '../types';

const colors = ['#818CF8', '#34D399', '#F472B6', '#FBBF24', '#60A5FA'];

export function SubjectsPage() {
  const {
    subjects,
    chapters,
    topics,
    addSubject,
    updateSubject,
    deleteSubject,
    addChapter,
    deleteChapter,
    addTopic,
    updateTopic,
    deleteTopic,
  } = useWorkspaceStore();
  const [subjectName, setSubjectName] = useState('');
  const [subjectDescription, setSubjectDescription] = useState('');
  const [subjectColor, setSubjectColor] = useState(colors[0]);
  const [chapterNames, setChapterNames] = useState<Record<string, string>>({});
  const [topicNames, setTopicNames] = useState<Record<string, string>>({});

  function submitSubject() {
    if (!subjectName.trim()) {
      return;
    }

    addSubject({
      name: subjectName.trim(),
      description: subjectDescription.trim(),
      color: subjectColor,
    });
    setSubjectName('');
    setSubjectDescription('');
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <div>
        <p className="text-sm font-medium text-indigo-300">Curriculum map</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Subjects</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Organize subjects into chapters and topics with progress tracking.
        </p>
      </div>

      <SurfaceCard>
        <SectionHeader title="Create Subject" />
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor="subject-name">Name</Label>
            <Input
              id="subject-name"
              value={subjectName}
              onChange={(event) => setSubjectName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject-description">Description</Label>
            <Input
              id="subject-description"
              value={subjectDescription}
              onChange={(event) => setSubjectDescription(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex h-11 items-center gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Use ${color}`}
                  onClick={() => setSubjectColor(color)}
                  className={`h-7 w-7 rounded-full border ${subjectColor === color ? 'border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
        <Button type="button" className="mt-4" onClick={submitSubject}>
          Add subject
        </Button>
      </SurfaceCard>

      <div className="grid gap-5">
        {subjects.map((subject) => {
          const subjectChapters = chapters.filter((chapter) => chapter.subjectId === subject.id);
          const progress = subjectProgress(subject.id, chapters, topics);

          return (
            <SurfaceCard key={subject.id}>
              <div className="flex flex-col justify-between gap-4 lg:flex-row">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <Input
                      value={subject.name}
                      onChange={(event) => updateSubject(subject.id, { name: event.target.value })}
                      className="max-w-sm border-transparent bg-transparent px-0 text-lg font-semibold text-white"
                    />
                  </div>
                  <Input
                    value={subject.description}
                    onChange={(event) =>
                      updateSubject(subject.id, { description: event.target.value })
                    }
                    className="mt-2 max-w-xl border-transparent bg-transparent px-0 text-sm text-zinc-400"
                  />
                </div>
                <div className="w-full lg:w-56">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-zinc-400">Completion</span>
                    <span className="text-white">{progress}%</span>
                  </div>
                  <ProgressBar value={progress} color={subject.color} />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => deleteSubject(subject.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {subjectChapters.map((chapter) => {
                  const chapterTopics = topics.filter((topic) => topic.chapterId === chapter.id);
                  const topicDraft = topicNames[chapter.id] ?? '';

                  return (
                    <div
                      key={chapter.id}
                      className="rounded-xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-medium text-white">{chapter.name}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteChapter(chapter.id)}
                        >
                          Delete
                        </Button>
                      </div>
                      <div className="mt-3 space-y-2">
                        {chapterTopics.map((topic) => (
                          <div key={topic.id} className="rounded-lg bg-white/[0.04] p-3">
                            <Input
                              value={topic.name}
                              onChange={(event) =>
                                updateTopic(topic.id, { name: event.target.value })
                              }
                              className="border-transparent bg-transparent px-0 font-medium text-white"
                            />
                            <div className="mt-2 grid gap-2 sm:grid-cols-3">
                              <select
                                value={topic.status}
                                onChange={(event) =>
                                  updateTopic(topic.id, {
                                    status: event.target.value as TopicStatus,
                                  })
                                }
                                className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-2 text-xs text-zinc-200"
                              >
                                <option value="learning">Learning</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="mastered">Mastered</option>
                              </select>
                              <select
                                value={topic.difficulty}
                                onChange={(event) =>
                                  updateTopic(topic.id, {
                                    difficulty: event.target.value as Difficulty,
                                  })
                                }
                                className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-2 text-xs text-zinc-200"
                              >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                              </select>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => deleteTopic(topic.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Input
                          value={topicDraft}
                          placeholder="New topic"
                          onChange={(event) =>
                            setTopicNames((drafts) => ({
                              ...drafts,
                              [chapter.id]: event.target.value,
                            }))
                          }
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (!topicDraft.trim()) return;
                            addTopic(chapter.id, { name: topicDraft.trim(), difficulty: 'medium' });
                            setTopicNames((drafts) => ({ ...drafts, [chapter.id]: '' }));
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <Input
                  value={chapterNames[subject.id] ?? ''}
                  placeholder="New chapter"
                  onChange={(event) =>
                    setChapterNames((drafts) => ({ ...drafts, [subject.id]: event.target.value }))
                  }
                />
                <Button
                  type="button"
                  onClick={() => {
                    const value = chapterNames[subject.id]?.trim();
                    if (!value) return;
                    addChapter(subject.id, value);
                    setChapterNames((drafts) => ({ ...drafts, [subject.id]: '' }));
                  }}
                >
                  Add chapter
                </Button>
              </div>
            </SurfaceCard>
          );
        })}
      </div>
    </div>
  );
}
