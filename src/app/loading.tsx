export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0C] text-white">
      <div className="glass relative flex w-80 flex-col items-center justify-center space-y-4 rounded-2xl p-8 text-center">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 opacity-70 blur-xl" />
        <div className="border-opacity-50 relative h-10 w-10 animate-spin rounded-full border-t-2 border-r-2 border-indigo-500" />
        <div className="relative">
          <h2 className="text-lg font-semibold tracking-wide text-zinc-200">Athena OS</h2>
          <p className="mt-1 text-xs text-zinc-500">Bootstrapping Workspace...</p>
        </div>
      </div>
    </div>
  );
}
