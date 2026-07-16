'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarkdownPreview } from '../components/Markdown';
import { SectionHeader, SurfaceCard } from '../components/Cards';
import { useWorkspaceStore } from '../store';

export function NotesPage() {
  const { notes, topics, addNote, updateNote, deleteNote } = useWorkspaceStore();
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(notes[0]?.id ?? '');
  const activeNote = notes.find((note) => note.id === activeId) ?? notes[0];

  const filteredNotes = useMemo(() => {
    const normalized = query.toLowerCase();
    return notes.filter((note) =>
      `${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase().includes(normalized),
    );
  }, [notes, query]);

  function createNote() {
    const id = addNote({
      title: 'Untitled note',
      content: '## New note\nStart writing...',
      tags: ['inbox'],
      topicId: topics[0]?.id,
    });
    setActiveId(id);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-indigo-300">Markdown knowledge base</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Notes</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Create, edit, search, tag, and link notes to topics.
          </p>
        </div>
        <Button type="button" onClick={createNote}>
          Create note
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <SurfaceCard>
          <SectionHeader title="Search Notes" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, body, tags..."
          />
          <div className="mt-4 space-y-2">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => setActiveId(note.id)}
                className={`w-full rounded-xl p-3 text-left transition ${
                  activeNote?.id === note.id
                    ? 'bg-white text-zinc-950'
                    : 'bg-black/20 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <span className="block truncate text-sm font-medium">{note.title}</span>
                <span className="mt-1 block truncate text-xs opacity-70">
                  {note.tags.join(', ')}
                </span>
              </button>
            ))}
          </div>
        </SurfaceCard>

        {activeNote ? (
          <div className="grid gap-6 xl:grid-cols-2">
            <SurfaceCard>
              <SectionHeader
                title="Editor"
                description="Auto-saves as you type"
                action={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => deleteNote(activeNote.id)}
                  >
                    Delete
                  </Button>
                }
              />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="note-title">Title</Label>
                  <Input
                    id="note-title"
                    value={activeNote.title}
                    onChange={(event) => updateNote(activeNote.id, { title: event.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="note-tags">Tags</Label>
                    <Input
                      id="note-tags"
                      value={activeNote.tags.join(', ')}
                      onChange={(event) =>
                        updateNote(activeNote.id, {
                          tags: event.target.value
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-topic">Topic</Label>
                    <select
                      id="note-topic"
                      value={activeNote.topicId ?? ''}
                      onChange={(event) =>
                        updateNote(activeNote.id, { topicId: event.target.value || undefined })
                      }
                      className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100"
                    >
                      <option value="">No topic</option>
                      {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <textarea
                  value={activeNote.content}
                  onChange={(event) => updateNote(activeNote.id, { content: event.target.value })}
                  className="min-h-[28rem] w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 font-mono text-sm leading-6 text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </SurfaceCard>

            <SurfaceCard>
              <SectionHeader title="Preview" description="Markdown rendering" />
              <MarkdownPreview content={activeNote.content} />
            </SurfaceCard>
          </div>
        ) : (
          <SurfaceCard>
            <p className="text-sm text-zinc-500">Create a note to begin.</p>
          </SurfaceCard>
        )}
      </div>
    </div>
  );
}
