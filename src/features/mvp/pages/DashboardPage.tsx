'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Flame, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeLearning } from '@/features/learning-engine';
import { useWorkspaceStore } from '../store';
import {
  dailyStudyHours,
  daysUntil,
  formatDate,
  formatDuration,
  getStudyGreeting,
  monthlyStudyMinutes,
  subjectDistribution,
  weeklyStudyHours,
} from '../utils';
import {
  AchievementBadge,
  AchievementToast,
  SkeletonCard,
} from '../components/DashboardExperience';
import { ProgressBar, SectionHeader, SurfaceCard } from '../components/Cards';
import {
  DailyHoursBarChart,
  SubjectDistributionChart,
  WeeklyHoursChart,
} from '../components/Charts';

const achievementExamples = [
  {
    id: 'first-study',
    title: 'First Study Session',
    description: 'Started your learning streak with a study session.',
    icon: '📘',
  },
  {
    id: 'streak-7',
    title: '7-Day Streak',
    description: 'Keep the momentum going for a full week.',
    icon: '🔥',
  },
  {
    id: 'first-flashcards',
    title: '100 Flashcards',
    description: 'Mastered 100 flashcards across subjects.',
    icon: '🧠',
  },
  {
    id: 'complete-subject',
    title: 'Complete Subject',
    description: 'Finished all topics in a subject.',
    icon: '🏆',
  },
  {
    id: 'first-pomodoro',
    title: 'First Pomodoro',
    description: 'Completed a focused 25-minute session.',
    icon: '⏱️',
  },
];

export function DashboardPage() {
  const {
    subjects,
    chapters,
    topics,
    tasks,
    notes,
    sessions,
    flashcards,
    exams,
    settings,
    isLoading,
  } = useWorkspaceStore();

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

  const upcomingRevision = intelligence.revisionQueue.slice(0, 4);
  const recommendations = intelligence.todayPriorities.slice(0, 5);
  const todayMinutes = intelligence.analytics.studiedTodayMinutes;
  const weeklyMinutes = weeklyStudyHours(sessions).reduce((sum, item) => sum + item.minutes, 0);
  const monthlyMinutes = monthlyStudyMinutes(sessions);
  const dailyGoalCompletion = settings.dailyGoalMinutes
    ? Math.min(100, Math.round((todayMinutes / settings.dailyGoalMinutes) * 100))
    : 0;
  const weeklyGoalMinutes = settings.dailyGoalMinutes * 7;
  const weeklyCompletion = weeklyGoalMinutes
    ? Math.min(100, Math.round((weeklyMinutes / weeklyGoalMinutes) * 100))
    : 0;
  const monthlyGoalMinutes = settings.dailyGoalMinutes * 30;
  const monthlyCompletion = monthlyGoalMinutes
    ? Math.min(100, Math.round((monthlyMinutes / monthlyGoalMinutes) * 100))
    : 0;
  const xp = Math.min(
    9999,
    Math.round(
      todayMinutes * 8 +
        weeklyMinutes * 2 +
        flashcards.length * 1.5 +
        intelligence.studyStreak * 10,
    ),
  );
  const level = Math.max(1, Math.floor(xp / 250) + 1);
  const nextLevelXp = level * 250;
  const xpProgress = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  const deadlines = [
    ...tasks
      .filter((task) => task.status !== 'done' && task.dueDate)
      .map((task) => ({
        id: task.id,
        title: task.title,
        date: task.dueDate!,
        type: 'Task',
      })),
    ...exams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      date: exam.date,
      type: 'Exam',
    })),
  ]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const achievements = achievementExamples.map((achievement) => {
    const unlocked =
      achievement.id === 'first-study'
        ? sessions.length > 0
        : achievement.id === 'streak-7'
          ? intelligence.studyStreak >= 7
          : achievement.id === 'first-flashcards'
            ? flashcards.length >= 100
            : achievement.id === 'complete-subject'
              ? intelligence.subjectReadiness.some((item) => item.completion >= 100)
              : achievement.id === 'first-pomodoro'
                ? sessions.some((session) => session.type === 'pomodoro')
                : false;

    return {
      ...achievement,
      unlocked,
      progress:
        achievement.id === 'first-study'
          ? sessions.length > 0
            ? 100
            : 0
          : achievement.id === 'streak-7'
            ? Math.min(100, Math.round((intelligence.studyStreak / 7) * 100))
            : achievement.id === 'first-flashcards'
              ? Math.min(100, Math.round((flashcards.length / 100) * 100))
              : achievement.id === 'complete-subject'
                ? Math.min(
                    100,
                    Math.round(
                      (intelligence.subjectReadiness.filter((item) => item.completion >= 100)
                        .length /
                        Math.max(1, intelligence.subjectReadiness.length)) *
                        100,
                    ),
                  )
                : achievement.id === 'first-pomodoro'
                  ? sessions.some((session) => session.type === 'pomodoro')
                    ? 100
                    : 0
                  : 0,
    };
  });

  const smartRecommendation = recommendations[0];
  const greeting = getStudyGreeting();

  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastData] = React.useState<{ title: string; message: string } | null>(() => {
    if (sessions.length === 1) {
      return {
        title: 'First Study Session',
        message: 'Congrats on starting your first focus session — your study journey begins now.',
      };
    }

    if (intelligence.studyStreak === 7) {
      return {
        title: '7-Day Streak',
        message: 'Your consistency is paying off. Keep the momentum going!',
      };
    }

    return null;
  });

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-6">
        <div className="grid gap-4 md:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <AchievementToast
        open={toastOpen && Boolean(toastData)}
        title={toastData?.title ?? ''}
        message={toastData?.message ?? ''}
        onDismiss={() => setToastOpen(false)}
      />

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-indigo-300">{greeting}, learner</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Athena Command Center
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            A calm, animated view of your learning progress, goals, and next best action.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/learning">
              <Zap />
              Review Plan
            </Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/pomodoro">Resume Pomodoro</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/tasks">Quick Add Task</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <SurfaceCard className="overflow-hidden">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/80 via-zinc-950/80 to-slate-950/90 p-6 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm tracking-[0.3em] text-indigo-300 uppercase">
                  Daily study goal
                </p>
                <p className="mt-3 text-4xl font-semibold text-white">
                  {formatDuration(settings.dailyGoalMinutes)} target
                </p>
                <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                  {todayMinutes} minutes logged today, {intelligence.studyStreak} day streak.
                </p>
              </div>
              <div className="rounded-3xl bg-black/30 p-5 text-white">
                <p className="text-xs tracking-[0.28em] text-indigo-300 uppercase">Level</p>
                <p className="mt-3 text-3xl font-semibold">{level}</p>
                <p className="mt-1 text-sm text-zinc-400">{xp} XP earned</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-xs tracking-[0.28em] text-zinc-500 uppercase">Today</p>
                <p className="mt-3 text-2xl font-semibold text-white">{dailyGoalCompletion}%</p>
                <p className="mt-1 text-sm text-zinc-400">Goal completion</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-xs tracking-[0.28em] text-zinc-500 uppercase">Weekly</p>
                <p className="mt-3 text-2xl font-semibold text-white">{weeklyCompletion}%</p>
                <p className="mt-1 text-sm text-zinc-400">Focus target</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-xs tracking-[0.28em] text-zinc-500 uppercase">Monthly</p>
                <p className="mt-3 text-2xl font-semibold text-white">{monthlyCompletion}%</p>
                <p className="mt-1 text-sm text-zinc-400">30-day momentum</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">Smart recommendation</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {smartRecommendation?.title ?? 'Keep learning with your prioritized next step.'}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {recommendations.length} queued items
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-300">
                {smartRecommendation?.reason ??
                  'Athena is waiting to recommend your next study activity.'}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild size="sm" variant="secondary">
                  <Link href={smartRecommendation?.href ?? '/learning'}>Continue studying</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/learning">View learning plan</Link>
                </Button>
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-6">
          <SectionHeader title="Quick Actions" description="Speed-run your learning workflow" />
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: '/notes', label: 'Create Note', icon: BookOpen },
              { href: '/tasks', label: 'Quick Add Task', icon: CheckCircle2 },
              { href: '/pomodoro', label: 'Resume Pomodoro', icon: Flame },
              { href: '/subjects', label: 'Recent Subjects', icon: BookOpen },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Button key={action.label} asChild size="sm" variant="secondary">
                  <Link href={action.href}>
                    <Icon />
                    {action.label}
                  </Link>
                </Button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white">Next Deadline</p>
            <div className="mt-4 space-y-3">
              {deadlines.length === 0 ? (
                <p className="text-sm text-zinc-500">No upcoming deadlines found.</p>
              ) : (
                deadlines.map((deadline) => {
                  const due = daysUntil(deadline.date);
                  return (
                    <div key={deadline.id} className="rounded-2xl bg-zinc-950/80 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-white">{deadline.title}</p>
                        <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-[11px] font-semibold tracking-[0.24em] text-indigo-300 uppercase">
                          {deadline.type}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">
                        Due {formatDate(deadline.date)} •{' '}
                        {due <= 0 ? 'Today' : due === 1 ? 'Tomorrow' : `${due} days`}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">XP Progress</p>
                <p className="mt-1 text-sm text-zinc-400">
                  {xp} / {nextLevelXp} XP to level {level + 1}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-white">{xpProgress}%</p>
                <p className="text-xs tracking-[0.28em] text-zinc-500 uppercase">
                  toward next level
                </p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-900">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SurfaceCard>
          <SectionHeader title="Today's Focus" description="Learning engine priority order" />
          <div className="space-y-3">
            {recommendations.length === 0 && (
              <p className="text-sm text-zinc-500">You have no priority items for today yet.</p>
            )}
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
          <SectionHeader title="Upcoming Revision" />
          <div className="space-y-3">
            {upcomingRevision.length === 0 ? (
              <p className="text-sm text-zinc-500">No revision due today.</p>
            ) : (
              upcomingRevision.map((item) => (
                <div key={item.id} className="rounded-xl bg-black/20 p-3">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {item.reason} • Due {formatDate(item.dueDate)}
                  </p>
                </div>
              ))
            )}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeader title="Achievements" description="Celebrate your learning milestones" />
          <div className="grid gap-3">
            {achievements.slice(0, 3).map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
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
            {subjects.length === 0 ? (
              <p className="text-sm text-zinc-500">Add a subject to begin tracking progress.</p>
            ) : (
              subjects.map((subject) => {
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
              })
            )}
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
    </div>
  );
}
