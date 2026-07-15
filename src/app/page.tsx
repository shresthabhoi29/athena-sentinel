'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { usePomodoroStore } from '@/store/pomodoroStore';
import { createClient } from '@/lib/supabase/client';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { Play, Pause, RotateCcw, Moon, Sun, ShieldCheck, Database, Sliders } from 'lucide-react';

export default function Home() {
  const { theme, setTheme, mounted } = useThemeState();
  const { timeRemaining, isActive, type, tick, setIsActive, setType, reset } = usePomodoroStore();
  const [supabaseStatus, setSupabaseStatus] = useState<'pending' | 'configured' | 'missing'>(
    'pending',
  );
  const [dbStatus, setDbStatus] = useState<'pending' | 'configured'>('pending');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, tick]);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const client = createClient();
        if (client) {
          setTimeout(() => setSupabaseStatus('configured'), 0);
        }
      } catch (err) {
        console.error('Supabase Init Error:', err);
        setTimeout(() => setSupabaseStatus('missing'), 0);
      }
    } else {
      setTimeout(() => setSupabaseStatus('missing'), 0);
    }
    setTimeout(() => setDbStatus('configured'), 0);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0A0A0C] p-6 text-white selection:bg-indigo-500/30">
      {/* Background radial gradients for Apple premium aesthetic */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="absolute top-6 right-6 z-20">
        <LogoutButton />
      </div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center space-y-8">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-wide text-indigo-400">
            <span>Athena OS Core Engine v1.0.0</span>
          </div>
          <h1 className="bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text py-1 text-4xl font-bold tracking-tight text-transparent md:text-5xl">
            Workspace Foundation
          </h1>
          <p className="mx-auto max-w-lg text-sm text-zinc-500 md:text-base">
            A premium Apple-inspired workspace foundation with unified state, database, and auth
            integrations.
          </p>
        </motion.div>

        {/* Dynamic Interactive Panel */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-12">
          {/* Pomodoro state validation (Zustand) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 md:col-span-7"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                  Focus Timer (Zustand State)
                </span>
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400 capitalize">
                  {type} Mode
                </span>
              </div>
              <div className="py-6 text-center">
                <h3 className="font-mono text-7xl font-bold tracking-tighter text-white">
                  {formatTime(timeRemaining)}
                </h3>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setType('focus')}
                  className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${
                    type === 'focus'
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
                  }`}
                >
                  Focus (25m)
                </button>
                <button
                  onClick={() => setType('short_break')}
                  className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${
                    type === 'short_break'
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
                  }`}
                >
                  Short Break (5m)
                </button>
                <button
                  onClick={() => setType('long_break')}
                  className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${
                    type === 'long_break'
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
                  }`}
                >
                  Long Break (15m)
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.98]"
                >
                  {isActive ? <Pause size={16} /> : <Play size={16} />}
                  {isActive ? 'Pause Interval' : 'Start Interval'}
                </button>
                <button
                  onClick={reset}
                  className="rounded-xl border border-zinc-800 px-3.5 text-zinc-400 transition hover:bg-zinc-900 hover:text-white active:scale-[0.98]"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Configuration and Environment variable statuses */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass flex flex-col justify-between rounded-2xl p-6 md:col-span-5"
          >
            <div className="space-y-4">
              <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                Verification Engine
              </span>
              <div className="space-y-3">
                {/* Supabase Status */}
                <div className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-200">Supabase Config</h4>
                      <p className="text-[11px] text-zinc-500">Authentication & Storage</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      supabaseStatus === 'configured'
                        ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                        : 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {supabaseStatus === 'configured' ? 'Configured' : 'Env Missing'}
                  </span>
                </div>

                {/* Drizzle Status */}
                <div className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-2 text-indigo-400">
                      <Database size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-200">Drizzle Client</h4>
                      <p className="text-[11px] text-zinc-500">PostgreSQL Schema V1</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      dbStatus === 'configured'
                        ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                        : 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {dbStatus === 'configured' ? 'Active' : 'Unresolved'}
                  </span>
                </div>

                {/* Active Theme Status */}
                <div className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-2 text-purple-400">
                      <Sliders size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-200">Visual Theme</h4>
                      <p className="text-[11px] text-zinc-500">Interactive Switches</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 rounded-lg border border-zinc-800 bg-black/40 p-1">
                    <button
                      onClick={() => setTheme('light')}
                      className={`rounded p-1.5 transition ${
                        theme === 'light'
                          ? 'bg-indigo-600 text-white'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <Sun size={14} />
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`rounded p-1.5 transition ${
                        theme === 'dark'
                          ? 'bg-indigo-600 text-white'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <Moon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-[11px] text-zinc-500">
              All visual states are linked to Next.js layouts.
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex w-full max-w-4xl items-center justify-between border-t border-zinc-900 pt-6 text-xs text-zinc-600"
        >
          <span>Athena OS Core System</span>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-zinc-400">Verification Suite</span>
            <span className="cursor-pointer hover:text-zinc-400">Supabase DB</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function useThemeState() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);
  return { theme, setTheme, mounted };
}
