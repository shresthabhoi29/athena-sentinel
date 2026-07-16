'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionHeader, SurfaceCard } from '../components/Cards';
import { useWorkspaceStore } from '../store';
import { formatDate } from '../utils';
import type { EntityStatus, Priority } from '../types';

export function TasksPage() {
  const { tasks, subjects, addTask, updateTask, deleteTask } = useWorkspaceStore();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [priority, setPriority] = useState<Priority>('medium');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? '');

  function submitTask() {
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      description: '',
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      subjectId: subjectId || undefined,
    });
    setTitle('');
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <div>
        <p className="text-sm font-medium text-indigo-300">Execution queue</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Tasks</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Plan work with priority, due dates, status, and calendar visibility.
        </p>
      </div>

      <SurfaceCard>
        <SectionHeader title="Create Task" />
        <div className="grid gap-3 lg:grid-cols-[1fr_10rem_10rem_12rem_auto]">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
          />
          <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
            className="h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
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
          <Button type="button" onClick={submitTask}>
            Add
          </Button>
        </div>
      </SurfaceCard>

      <div className="grid gap-4 lg:grid-cols-3">
        {(['todo', 'in_progress', 'done'] as EntityStatus[]).map((status) => (
          <SurfaceCard key={status}>
            <SectionHeader title={status.replace('_', ' ').toUpperCase()} />
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div key={task.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <Input
                      value={task.title}
                      onChange={(event) => updateTask(task.id, { title: event.target.value })}
                      className="border-transparent bg-transparent px-0 font-medium text-white"
                    />
                    <div className="mt-2 grid gap-2">
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={task.description}
                        onChange={(event) =>
                          updateTask(task.id, { description: event.target.value })
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={task.status}
                          onChange={(event) =>
                            updateTask(task.id, { status: event.target.value as EntityStatus })
                          }
                          className="h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-2 text-xs text-zinc-100"
                        >
                          <option value="todo">Todo</option>
                          <option value="in_progress">In progress</option>
                          <option value="done">Done</option>
                        </select>
                        <select
                          value={task.priority}
                          onChange={(event) =>
                            updateTask(task.id, { priority: event.target.value as Priority })
                          }
                          className="h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-2 text-xs text-zinc-100"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <p className="text-xs text-zinc-500">Due {formatDate(task.dueDate)}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
