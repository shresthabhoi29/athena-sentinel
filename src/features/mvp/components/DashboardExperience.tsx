'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export type AchievementSummary = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  icon: string;
};

export function AchievementBadge({ achievement }: { achievement: AchievementSummary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'rounded-3xl border border-white/10 bg-zinc-950/80 p-4 shadow-lg shadow-black/10',
        achievement.unlocked ? 'ring-1 ring-emerald-400/20' : 'opacity-80',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-lg text-indigo-300">
          {achievement.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{achievement.title}</p>
          <p className="mt-1 text-xs text-zinc-500">{achievement.description}</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-900">
        <div
          className="h-full rounded-full bg-emerald-400 transition-all"
          style={{ width: `${achievement.progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs font-medium text-zinc-400">
        {achievement.unlocked ? 'Unlocked' : `${achievement.progress}% complete`}
      </p>
    </motion.div>
  );
}

export function AchievementToast({
  open,
  title,
  message,
  onDismiss,
}: {
  open: boolean;
  title: string;
  message: string;
  onDismiss: () => void;
}) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-live="polite"
      className="fixed right-6 bottom-6 z-50 w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-950/95 px-5 py-4 shadow-2xl shadow-black/40 backdrop-blur-xl"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
          ✨
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm leading-6 text-zinc-400">{message}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none"
          aria-label="Dismiss achievement toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-3xl bg-zinc-900/70 p-6 shadow-inner', className)}>
      <div className="mb-4 h-5 w-3/4 rounded-full bg-zinc-800" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded-full bg-zinc-800" />
        <div className="h-4 w-5/6 rounded-full bg-zinc-800" />
        <div className="h-4 w-2/3 rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}
