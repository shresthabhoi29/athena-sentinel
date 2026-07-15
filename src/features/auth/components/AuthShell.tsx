'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0C] px-4 py-10 text-white selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0)_35%),radial-gradient(circle_at_top,rgba(99,102,241,0.14),transparent_34rem)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/75 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"
        aria-labelledby="auth-title"
      >
        <Link
          href="/"
          className="mb-8 inline-flex text-xs font-semibold tracking-[0.24em] text-indigo-300 uppercase"
        >
          Athena OS
        </Link>
        <div className="space-y-2">
          <h1 id="auth-title" className="text-2xl font-semibold tracking-tight text-zinc-50">
            {title}
          </h1>
          <p className="text-sm leading-6 text-zinc-400">{subtitle}</p>
        </div>

        <div className="mt-7">{children}</div>

        {footer && <div className="mt-6 border-t border-white/10 pt-5 text-sm">{footer}</div>}
      </motion.section>
    </main>
  );
}
