'use client';

import Link from 'next/link';
import { analyzeLearning, type StudyHeatmapDay } from '@/features/learning-engine';
import { MetricCard, ProgressBar, SectionHeader, SurfaceCard } from '../components/Cards';
import { useWorkspaceStore } from '../store';
import { formatDate } from '../utils';

const heatmapClasses: Record<StudyHeatmapDay['intensity'], string> = {
  0: 'bg-white/[0.04]',
  1: 'bg-emerald-500/20',
  2: 'bg-emerald-500/35',
  3: 'bg-emerald-400/55',
  4: 'bg-emerald-300/80',
};

export function LearningPage() {
  const { flashcards, tasks, topics, exams, subjects, chapters, sessions, settings } =
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
  const recommendations = intelligence.studyRecommendations.slice(0, 8);

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <div>
        <p className="text-sm font-medium text-indigo-300">Recommendation engine</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Learning</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Priority: overdue flashcards, due tasks, weak topics, exams, active subjects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Readiness"
          value={`${intelligence.analytics.readinessScore}%`}
          detail="Average subject readiness"
        />
        <MetricCard
          label="Consistency"
          value={`${intelligence.analytics.studyConsistency}%`}
          detail="Study days this week"
        />
        <MetricCard
          label="Completion"
          value={`${intelligence.completionPercentage}%`}
          detail="Tasks and topics"
        />
        <MetricCard
          label="Today"
          value={`${intelligence.analytics.dailyGoalCompletion}%`}
          detail={`${intelligence.analytics.studiedTodayMinutes}/${settings.dailyGoalMinutes}m goal`}
        />
      </div>

      <SurfaceCard>
        <SectionHeader
          title="Recommended Next Moves"
          description={`${intelligence.estimatedDailyStudyTime} minutes estimated across the top priorities`}
        />
        <div className="space-y-3">
          {recommendations.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/10"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-semibold text-zinc-950">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-sm text-zinc-500">
                  {item.reason} • {item.estimatedMinutes}m • score {item.score}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </SurfaceCard>

      <div className="grid gap-6 md:grid-cols-2">
        <SurfaceCard>
          <SectionHeader title="Weak Topics" description="Highest score means highest attention" />
          <div className="space-y-3">
            {intelligence.weakTopics.slice(0, 6).map((item) => (
              <div key={item.topic.id} className="rounded-xl bg-black/20 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{item.topic.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.reasons.join(', ')}</p>
                  </div>
                  <span className="text-xs text-indigo-300">{item.score}</span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={item.completion} color={item.subject?.color} />
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeader title="Strong Topics" description="Lower pressure, higher confidence" />
          <div className="space-y-3">
            {intelligence.strongTopics.slice(0, 6).map((item) => (
              <div key={item.topic.id} className="rounded-xl bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{item.topic.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.reasons.join(', ')}</p>
                  </div>
                  <span className="text-xs text-emerald-300">{item.completion}%</span>
                </div>
              </div>
            ))}
            {intelligence.strongTopics.length === 0 && (
              <p className="text-sm text-zinc-500">Master topics to build this list.</p>
            )}
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SurfaceCard>
          <SectionHeader title="Revision Queue" description="Due flashcards and topic reviews" />
          <div className="space-y-3">
            {intelligence.revisionQueue.slice(0, 7).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block rounded-xl border border-white/10 bg-black/20 p-3 transition hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {item.reason} • due {formatDate(item.dueDate)}
                    </p>
                  </div>
                  <span className="text-xs text-indigo-300">{item.type}</span>
                </div>
              </Link>
            ))}
            {intelligence.revisionQueue.length === 0 && (
              <p className="text-sm text-zinc-500">No revision is due right now.</p>
            )}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeader title="Subject Readiness" description="Completion adjusted by pressure" />
          <div className="space-y-4">
            {intelligence.subjectReadiness.map((item) => (
              <div key={item.subject.id}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-zinc-300">{item.subject.name}</span>
                  <span className="text-zinc-500">{item.readiness}% ready</span>
                </div>
                <ProgressBar value={item.readiness} color={item.subject.color} />
                <p className="mt-2 text-xs text-zinc-500">{item.reasons.join(' • ')}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr]">
        <SurfaceCard>
          <SectionHeader title="Overdue Work" />
          <div className="space-y-3">
            {intelligence.overdueWork.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between gap-3 rounded-xl bg-black/20 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {item.daysOverdue} days overdue • {item.type}
                  </p>
                </div>
                <span className="text-xs text-red-300">{item.score}</span>
              </Link>
            ))}
            {intelligence.overdueWork.length === 0 && (
              <p className="text-sm text-zinc-500">Nothing overdue. Keep the rhythm.</p>
            )}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <SectionHeader
            title="Study Consistency"
            description={`${intelligence.analytics.studiedLastSevenDaysMinutes} minutes logged in the last seven days`}
          />
          <div className="grid grid-cols-7 gap-2">
            {intelligence.analytics.heatmapData.map((day) => (
              <div key={day.date} className="space-y-1">
                <div
                  title={`${day.date}: ${day.minutes}m`}
                  className={`aspect-square rounded-lg ${heatmapClasses[day.intensity]}`}
                />
                <p className="text-center text-[10px] text-zinc-600">{day.day.slice(0, 1)}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
