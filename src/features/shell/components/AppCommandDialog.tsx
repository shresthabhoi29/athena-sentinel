'use client';

import { Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useWorkspaceStore } from '@/features/mvp/store';
import { quickAddActions, shellNavItems } from '../navigation';

type CommandMode = 'search' | 'quick-add';

type AppCommandDialogProps = {
  open: boolean;
  mode: CommandMode;
  onOpenChange: (open: boolean) => void;
  onModeChange: (mode: CommandMode) => void;
};

export function AppCommandDialog({
  open,
  mode,
  onOpenChange,
  onModeChange,
}: AppCommandDialogProps) {
  const router = useRouter();
  const {
    subjects,
    chapters,
    topics,
    notes,
    tasks,
    addTask,
    addNote,
    addSubject,
    addFlashcard,
    addResource,
  } = useWorkspaceStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onModeChange('search');
        onOpenChange(true);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onModeChange, onOpenChange]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setQuery('');
    }

    onOpenChange(nextOpen);
  }

  const visibleRoutes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const routeResults = shellNavItems.map((item) => ({
      id: `route-${item.href}`,
      title: item.title,
      description: item.description,
      href: item.href,
      icon: item.icon,
    }));
    const dataResults = [
      ...subjects.map((subject) => ({
        id: `subject-${subject.id}`,
        title: subject.name,
        description: `Subject • ${subject.description}`,
        href: '/subjects',
        icon:
          shellNavItems.find((item) => item.href === '/subjects')?.icon ?? shellNavItems[0].icon,
      })),
      ...topics.map((topic) => ({
        id: `topic-${topic.id}`,
        title: topic.name,
        description: `Topic • ${topic.status}`,
        href: '/subjects',
        icon:
          shellNavItems.find((item) => item.href === '/learning')?.icon ?? shellNavItems[0].icon,
      })),
      ...notes.map((note) => ({
        id: `note-${note.id}`,
        title: note.title,
        description: `Note • ${note.tags.join(', ')}`,
        href: '/notes',
        icon: shellNavItems.find((item) => item.href === '/notes')?.icon ?? shellNavItems[0].icon,
      })),
      ...tasks.map((task) => ({
        id: `task-${task.id}`,
        title: task.title,
        description: `Task • ${task.status} • ${task.priority}`,
        href: '/tasks',
        icon: shellNavItems.find((item) => item.href === '/tasks')?.icon ?? shellNavItems[0].icon,
      })),
    ];
    const allResults = [...routeResults, ...dataResults];

    if (!normalizedQuery) {
      return allResults.slice(0, 12);
    }

    return allResults.filter((item) =>
      `${item.title} ${item.description}`.toLowerCase().includes(normalizedQuery),
    );
  }, [notes, query, subjects, tasks, topics]);

  function runQuickAction(title: string) {
    if (title === 'Task') {
      addTask({
        title: 'New task',
        description: '',
        priority: 'medium',
        dueDate: new Date().toISOString(),
        subjectId: subjects[0]?.id,
      });
      router.push('/tasks');
    } else if (title === 'Note') {
      addNote({
        title: 'New note',
        content: '## New note\nStart writing...',
        tags: ['inbox'],
        topicId: topics[0]?.id,
      });
      router.push('/notes');
    } else if (title === 'Subject') {
      addSubject({
        name: 'New Subject',
        description: 'Describe this subject.',
        color: '#818CF8',
      });
      router.push('/subjects');
    } else if (title === 'Flashcard') {
      addFlashcard({
        front: 'New question',
        back: 'New answer',
        topicId: topics[0]?.id,
      });
      router.push('/flashcards');
    } else if (title === 'Resource') {
      addResource({
        title: 'New resource',
        url: 'https://example.com',
        type: 'Link',
        subjectId: subjects[0]?.id,
      });
      router.push('/Sentinel');
    } else {
      if (chapters[0]) {
        router.push('/learning');
      }
    }

    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden">
        <div className="border-b border-white/10 px-5 pt-5 pb-4">
          <DialogTitle className="text-lg font-semibold text-white">
            {mode === 'quick-add' ? 'Quick Add' : 'Command Palette'}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-zinc-500">
            {mode === 'quick-add'
              ? 'Creation actions are staged for future features.'
              : 'Search Athena OS routes and actions.'}
          </DialogDescription>
        </div>

        <div className="border-b border-white/10 px-5 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={mode === 'quick-add' ? 'Filter actions...' : 'Search routes...'}
              className="pl-9"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-[24rem] overflow-y-auto p-3">
          {mode === 'quick-add' ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {quickAddActions
                .filter((item) =>
                  `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()),
                )
                .map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => runQuickAction(item.title)}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-white">
                        <Icon className="h-4 w-4 text-indigo-300" />
                        {item.title}
                      </span>
                      <span className="mt-2 block text-xs leading-5 text-zinc-500">
                        {item.description}
                      </span>
                    </button>
                  );
                })}
            </div>
          ) : (
            <div className="space-y-2">
              {visibleRoutes.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none"
                    onClick={() => handleOpenChange(false)}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-indigo-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">
                        {item.title}
                      </span>
                      <span className="block truncate text-xs text-zinc-500">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Architecture only
          </span>
          <span>Ctrl K</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
