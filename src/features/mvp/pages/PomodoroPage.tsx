'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionHeader, SurfaceCard } from '../components/Cards';
import { useWorkspaceStore } from '../store';
import { formatDate } from '../utils';
import type { SessionType } from '../types';

export function PomodoroPage() {
  const { subjects, topics, settings, updateSettings, addSession, sessions } = useWorkspaceStore();
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const duration =
    mode === 'focus'
      ? settings.pomodoroWorkDuration
      : mode === 'short'
        ? settings.pomodoroShortBreak
        : settings.pomodoroLongBreak;
  const [seconds, setSeconds] = useState(duration * 60);
  const [active, setActive] = useState(false);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? '');
  const [topicId, setTopicId] = useState(topics[0]?.id ?? '');
  const [manualMinutes, setManualMinutes] = useState(30);
  const [manualType, setManualType] = useState<SessionType>('self_study');

  useEffect(() => {
    if (!active) return;
    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setActive(false);
          if (mode === 'focus') {
            addSession({
              subjectId,
              topicId,
              durationMinutes: duration,
              date: new Date().toISOString(),
              type: 'pomodoro',
            });
          }
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [active, addSession, duration, mode, subjectId, topicId]);

  const stats = useMemo(() => {
    const pomodoros = sessions.filter((session) => session.type === 'pomodoro');
    return {
      count: pomodoros.length,
      minutes: pomodoros.reduce((sum, session) => sum + session.durationMinutes, 0),
    };
  }, [sessions]);

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <div>
        <p className="text-sm font-medium text-indigo-300">Deep work timer</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Pomodoro</h1>
      </div>
      <SurfaceCard className="text-center">
        <div className="flex justify-center gap-2">
          {(['focus', 'short', 'long'] as const).map((item) => (
            <Button
              key={item}
              type="button"
              variant={mode === item ? 'default' : 'secondary'}
              size="sm"
              onClick={() => {
                const nextDuration =
                  item === 'focus'
                    ? settings.pomodoroWorkDuration
                    : item === 'short'
                      ? settings.pomodoroShortBreak
                      : settings.pomodoroLongBreak;
                setMode(item);
                setSeconds(nextDuration * 60);
                setActive(false);
              }}
            >
              {item}
            </Button>
          ))}
        </div>
        <p className="mt-8 font-mono text-7xl font-semibold tracking-tight text-white">
          {mins}:{secs}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button type="button" onClick={() => setActive((value) => !value)}>
            {active ? 'Pause' : 'Start'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setActive(false);
              setSeconds(duration * 60);
            }}
          >
            Reset
          </Button>
        </div>
      </SurfaceCard>
      <div className="grid gap-6 lg:grid-cols-2">
        <SurfaceCard>
          <SectionHeader title="Session Logging" />
          <div className="grid gap-3">
            <Label>Subject</Label>
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
            <Label>Topic</Label>
            <select
              value={topicId}
              onChange={(event) => setTopicId(event.target.value)}
              className="h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100"
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
        </SurfaceCard>
        <SurfaceCard>
          <SectionHeader title="Custom Durations" description="Stored in Settings" />
          <div className="grid gap-3">
            <Input
              type="number"
              value={settings.pomodoroWorkDuration}
              onChange={(event) => {
                const value = Number(event.target.value);
                updateSettings({ pomodoroWorkDuration: value });
                if (mode === 'focus') setSeconds(value * 60);
              }}
            />
            <Input
              type="number"
              value={settings.pomodoroShortBreak}
              onChange={(event) => {
                const value = Number(event.target.value);
                updateSettings({ pomodoroShortBreak: value });
                if (mode === 'short') setSeconds(value * 60);
              }}
            />
            <Input
              type="number"
              value={settings.pomodoroLongBreak}
              onChange={(event) => {
                const value = Number(event.target.value);
                updateSettings({ pomodoroLongBreak: value });
                if (mode === 'long') setSeconds(value * 60);
              }}
            />
            <p className="text-sm text-zinc-500">
              {stats.count} pomodoros logged, {stats.minutes} minutes total.
            </p>
          </div>
        </SurfaceCard>
      </div>
      <SurfaceCard>
        <SectionHeader
          title="Study Sessions"
          description="Track subject, topic, duration, date, and type."
        />
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_8rem_10rem_auto]">
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
          <select
            value={topicId}
            onChange={(event) => setTopicId(event.target.value)}
            className="h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100"
          >
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
          <Input
            type="number"
            value={manualMinutes}
            onChange={(event) => setManualMinutes(Number(event.target.value))}
          />
          <select
            value={manualType}
            onChange={(event) => setManualType(event.target.value as SessionType)}
            className="h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100"
          >
            <option value="self_study">Self study</option>
            <option value="revision">Revision</option>
            <option value="flashcards">Flashcards</option>
            <option value="pomodoro">Pomodoro</option>
          </select>
          <Button
            type="button"
            onClick={() =>
              addSession({
                subjectId,
                topicId,
                durationMinutes: manualMinutes,
                date: new Date().toISOString(),
                type: manualType,
              })
            }
          >
            Log
          </Button>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {sessions.slice(0, 8).map((session) => (
            <div
              key={session.id}
              className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-zinc-300"
            >
              {session.durationMinutes}m {session.type} • {formatDate(session.date)}
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
