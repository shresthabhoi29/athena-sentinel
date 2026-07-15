import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0C] p-4 text-white">
      <div className="glass relative flex w-full max-w-md flex-col items-center justify-center space-y-6 rounded-2xl p-8 text-center">
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/5 opacity-50 blur-xl" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
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
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
          </svg>
        </div>
        <div className="relative space-y-2">
          <h2 className="text-xl font-semibold tracking-wide text-zinc-200">Segment Not Found</h2>
          <p className="text-sm text-zinc-400">
            The path segment you are trying to resolve does not exist in Athena OS configuration.
          </p>
        </div>
        <div className="relative w-full">
          <Link
            href="/"
            className="inline-flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/30"
          >
            Return to Core
          </Link>
        </div>
      </div>
    </div>
  );
}
