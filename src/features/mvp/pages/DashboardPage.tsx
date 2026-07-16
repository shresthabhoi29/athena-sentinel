'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle2, Flame, Plus, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeLearning } from '@/features/learning-engine';
import { useWorkspaceStore } from '../store';
import {
  dailyStudyHours,
  formatDate,
  isToday,
  subjectDistribution,
  weeklyStudyHours,
} from '../utils';
import { MetricCard, ProgressBar, SectionHeader, SurfaceCard } from '../components/Cards';
import {
  DailyHoursBarChart,
  SubjectDistributionChart,
  WeeklyHoursChart,
} from '../components/Charts';

export function DashboardPage() {
  const { subjects, chapters, topics, tasks, notes, sessions, flashcards, exams, settings } =
    useWorkspaceStore();
  const intelligence = analyzeLearning({
    subjects,
    chapters,
    topics,
    tasks,
    sessions,
    flashcards,
    exams,
    settings,
  });
  const todaysTasks = tasks.filter((task) => task.status !== 'done' && isToday(task.dueDate));
  const upcomingRevision = intelligence.revisionQueue.slice(0, 4);
  const recommendations = intelligence.todayPriorities.slice(0, 5);
  const todayMinutes = intelligence.analytics.studiedTodayMinutes;
  const progress = intelligence.completionPercentage;

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-indigo-300">Good to see you back</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Student Command Center
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Your study plan, revision pressure, focus timer, and learning recommendations in one
            place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/notes">
              <Plus />
              Create Note
            </Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/tasks">Create Task</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/pomodoro">Start Pomodoro</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/subjects">Open Subject</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Today"
          value={`${todayMinutes}/${settings.dailyGoalMinutes}m`}
          detail="Study minutes logged"
        />
        <MetricCard
          label="Streak"
          value={`${intelligence.studyStreak} days`}
          detail="Consecutive study days"
        />
        <MetricCard label="Completion" value={`${progress}%`} detail="Tasks and topics complete" />
        <MetricCard
          label="Plan"
          value={`${intelligence.estimatedDailyStudyTime}m`}
          detail="Estimated focus time"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SurfaceCard>
          <SectionHeader title="Today's Focus" description="Learning engine priority order" />
          <div className="space-y-3">
            {recommendations.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-3 transition hover:bg-white/10"
              >
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-zinc-500">
                    {item.reason} • score {item.score}
                  </p>
                </div>
                <span className="text-xs text-indigo-300">Open</span>
              </Link>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeader
            title="Pomodoro Widget"
            description="25/5 defaults, editable in Settings"
          />
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-zinc-950">
              <Timer className="h-7 w-7" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">
                {settings.pomodoroWorkDuration}:00
              </p>
              <p className="text-sm text-zinc-500">Focus interval ready</p>
            </div>
          </div>
          <Button asChild className="mt-5 w-full">
            <Link href="/pomodoro">Start focus session</Link>
          </Button>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SurfaceCard>
          <SectionHeader title="Today's Tasks" />
          <div className="space-y-3">
            {todaysTasks.length === 0 && (
              <p className="text-sm text-zinc-500">No tasks due today.</p>
            )}
            {todaysTasks.map((task) => (
              <div key={task.id} className="rounded-xl bg-black/20 p-3">
                <p className="text-sm font-medium text-white">{task.title}</p>
                <p className="mt-1 text-xs text-zinc-500">{task.priority} priority</p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeader title="Upcoming Revision" />
          <div className="space-y-3">
            {upcomingRevision.map((item) => (
              <div key={item.id} className="rounded-xl bg-black/20 p-3">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {item.reason} • Due {formatDate(item.dueDate)}
                </p>
              </div>
            ))}
            {upcomingRevision.length === 0 && (
              <p className="text-sm text-zinc-500">No revision due today.</p>
            )}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeader title="Upcoming Exams" />
          <div className="space-y-3">
            {exams.map((exam) => (
              <div key={exam.id} className="rounded-xl bg-black/20 p-3">
                <p className="text-sm font-medium text-white">{exam.title}</p>
                <p className="mt-1 text-xs text-zinc-500">{formatDate(exam.date)}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <SurfaceCard>
          <SectionHeader title="Weekly Study Hours Chart" description="Logged study sessions" />
          <WeeklyHoursChart data={weeklyStudyHours(sessions)} />
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeader title="Study Progress" />
          <div className="space-y-4">
            {subjects.map((subject) => {
              const readiness = intelligence.subjectReadiness.find(
                (item) => item.subject.id === subject.id,
              );
              const value = readiness?.completion ?? 0;
              return (
                <div key={subject.id}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-zinc-300">{subject.name}</span>
                    <span className="text-zinc-500">
                      {value}% • {readiness?.readiness ?? 0}% ready
                    </span>
                  </div>
                  <ProgressBar value={value} color={subject.color} />
                </div>
              );
            })}
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SurfaceCard>
          <SectionHeader title="Daily Hours" description="Last seven days" />
          <DailyHoursBarChart data={dailyStudyHours(sessions)} />
        </SurfaceCard>
        <SurfaceCard>
          <SectionHeader title="Subject Distribution" description="Minutes by subject" />
          <SubjectDistributionChart data={subjectDistribution(subjects, sessions)} />
        </SurfaceCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SurfaceCard>
          <SectionHeader title="Recent Notes" />
          <div className="space-y-3">
            {notes.slice(0, 4).map((note) => (
              <Link key={note.id} href="/notes" className="block rounded-xl bg-black/20 p-3">
                <p className="text-sm font-medium text-white">{note.title}</p>
                <p className="mt-1 text-xs text-zinc-500">{note.tags.join(', ')}</p>
              </Link>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeader title="Recent Subjects" />
          <div className="grid gap-3 sm:grid-cols-2">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href="/subjects"
                className="rounded-xl border border-white/10 bg-black/20 p-3"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-white">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  {subject.name}
                </span>
                <p className="mt-2 line-clamp-2 text-xs text-zinc-500">{subject.description}</p>
              </Link>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard>
        <SectionHeader title="Quick Actions" />
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { href: '/notes', label: 'Create Note', icon: BookOpen },
            { href: '/tasks', label: 'Create Task', icon: CheckCircle2 },
            { href: '/pomodoro', label: 'Start Pomodoro', icon: Flame },
            { href: '/subjects', label: 'Open Subject', icon: BookOpen },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Button key={action.label} asChild variant="secondary">
                <Link href={action.href}>
                  <Icon />
                  {action.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </SurfaceCard>
    </div>
  );
}
