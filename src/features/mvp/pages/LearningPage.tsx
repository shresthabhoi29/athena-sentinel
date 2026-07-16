'use client';

import Link from 'next/link';
import { SectionHeader, SurfaceCard } from '../components/Cards';
import { useWorkspaceStore } from '../store';
import { buildRecommendations, formatDate } from '../utils';

export function LearningPage() {
  const { flashcards, tasks, topics, exams, subjects } = useWorkspaceStore();
  const recommendations = buildRecommendations({ flashcards, tasks, topics, exams, subjects });

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <div>
        <p className="text-sm font-medium text-indigo-300">Recommendation engine</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Learning</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Priority: overdue flashcards, due tasks, weak topics, exams, active subjects.
        </p>
      </div>
      <SurfaceCard>
        <SectionHeader title="Recommended Next Moves" />
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
                <p className="text-sm text-zinc-500">{item.reason}</p>
              </div>
            </Link>
          ))}
        </div>
      </SurfaceCard>
      <div className="grid gap-6 md:grid-cols-2">
        <SurfaceCard>
          <SectionHeader title="Weak Topics" />
          {topics
            .filter((topic) => topic.difficulty === 'hard' && topic.status !== 'mastered')
            .map((topic) => (
              <p key={topic.id} className="rounded-xl bg-black/20 p-3 text-sm text-zinc-300">
                {topic.name} • due {formatDate(topic.nextReviewDate)}
              </p>
            ))}
        </SurfaceCard>
        <SurfaceCard>
          <SectionHeader title="Upcoming Exams" />
          {exams.map((exam) => (
            <p key={exam.id} className="rounded-xl bg-black/20 p-3 text-sm text-zinc-300">
              {exam.title} • {formatDate(exam.date)}
            </p>
          ))}
        </SurfaceCard>
      </div>
    </div>
  );
}
