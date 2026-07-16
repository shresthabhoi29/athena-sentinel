'use client';

import { useMemo, useState } from 'react';
import { SectionHeader, SurfaceCard } from '../components/Cards';
import { useWorkspaceStore } from '../store';
import { isSameDay } from '../utils';

export function CalendarPage() {
  const { tasks, sessions, topics } = useWorkspaceStore();
  const [cursor, setCursor] = useState(new Date());
  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [cursor]);

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-300">Planning view</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Calendar</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Monthly view for tasks, study sessions, and revisions.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-xl border border-white/10 px-3 py-2 text-sm"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            Prev
          </button>
          <button
            className="rounded-xl border border-white/10 px-3 py-2 text-sm"
            onClick={() => setCursor(new Date())}
          >
            Today
          </button>
          <button
            className="rounded-xl border border-white/10 px-3 py-2 text-sm"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            Next
          </button>
        </div>
      </div>
      <SurfaceCard>
        <SectionHeader
          title={new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(cursor)}
        />
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-zinc-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-7">
          {days.map((date) => {
            const dayTasks = tasks.filter(
              (task) => task.dueDate && isSameDay(new Date(task.dueDate), date),
            );
            const daySessions = sessions.filter((session) =>
              isSameDay(new Date(session.date), date),
            );
            const dayRevisions = topics.filter(
              (topic) => topic.nextReviewDate && isSameDay(new Date(topic.nextReviewDate), date),
            );
            const muted = date.getMonth() !== cursor.getMonth();
            return (
              <div
                key={date.toISOString()}
                className={`min-h-32 rounded-xl border border-white/10 bg-black/20 p-2 ${muted ? 'opacity-40' : ''}`}
              >
                <p className="text-sm font-medium text-white">{date.getDate()}</p>
                <div className="mt-2 space-y-1">
                  {dayTasks.slice(0, 2).map((task) => (
                    <p
                      key={task.id}
                      className="truncate rounded bg-indigo-500/15 px-2 py-1 text-[11px] text-indigo-200"
                    >
                      {task.title}
                    </p>
                  ))}
                  {daySessions.slice(0, 2).map((session) => (
                    <p
                      key={session.id}
                      className="truncate rounded bg-emerald-500/15 px-2 py-1 text-[11px] text-emerald-200"
                    >
                      {session.durationMinutes}m {session.type}
                    </p>
                  ))}
                  {dayRevisions.slice(0, 2).map((topic) => (
                    <p
                      key={topic.id}
                      className="truncate rounded bg-amber-500/15 px-2 py-1 text-[11px] text-amber-200"
                    >
                      {topic.name}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SurfaceCard>
    </div>
  );
}
