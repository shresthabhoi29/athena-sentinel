'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AIChat } from '../components/AIChat';
import { SectionHeader, SurfaceCard } from '../components/Cards';
import { useWorkspaceStore } from '../store';

export function SentinelPage() {
  const { Sentinel, subjects, addResource } = useWorkspaceStore();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? '');

  function submitResource() {
    if (!title.trim() || !url.trim()) return;
    addResource({ title: title.trim(), url: url.trim(), type: 'Link', subjectId });
    setTitle('');
    setUrl('');
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <div>
        <p className="text-sm font-medium text-indigo-300">References and AI</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Sentinel</h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <SurfaceCard>
            <SectionHeader title="Add Resource" />
            <div className="grid gap-3">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Title"
              />
              <Input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="URL"
              />
              <select
                value={subjectId}
                onChange={(event) => setSubjectId(event.target.value)}
                className="h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100"
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <Button type="button" onClick={submitResource}>
                Save resource
              </Button>
            </div>
          </SurfaceCard>
          <SurfaceCard>
            <SectionHeader title="Saved Sentinel" />
            <div className="space-y-3">
              {Sentinel.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl bg-black/20 p-3"
                >
                  <p className="text-sm font-medium text-white">{resource.title}</p>
                  <p className="mt-1 truncate text-xs text-zinc-500">{resource.url}</p>
                </a>
              ))}
            </div>
          </SurfaceCard>
        </div>
        <SurfaceCard>
          <SectionHeader title="AI Chat" description="OpenRouter-powered study assistant" />
          <AIChat />
        </SurfaceCard>
      </div>
    </div>
  );
}
