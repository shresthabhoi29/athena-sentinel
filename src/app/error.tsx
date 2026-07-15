'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('System Exception:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0C] p-4 text-white">
      <div className="glass relative flex w-full max-w-md flex-col items-center justify-center space-y-6 rounded-2xl p-8 text-center">
        <div className="absolute inset-0 rounded-2xl bg-red-500/5 opacity-50 blur-xl" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </div>
        <div className="relative space-y-2">
          <h2 className="text-xl font-semibold tracking-wide text-zinc-200">System Interrupt</h2>
          <p className="text-sm text-zinc-400">
            An unexpected crash occurred inside the Athena OS kernel workspace.
          </p>
          {error.digest && (
            <p className="mt-2 rounded bg-black/30 px-2 py-1 font-mono text-xs text-zinc-600 select-all">
              Digest: {error.digest}
            </p>
          )}
        </div>
        <div className="relative flex w-full flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-400 transition duration-200 hover:bg-zinc-900"
          >
            Reload Shell
          </button>
          <button
            onClick={() => reset()}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/30"
          >
            Resume Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
