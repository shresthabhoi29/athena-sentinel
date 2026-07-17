export default function SentinelPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-8 py-24">
        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-sm text-cyan-300">
          Athena Sentinel
        </span>

        <h1 className="mt-8 text-center text-6xl font-bold tracking-tight">
          The AI Study Companion
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            That Learns You
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-center text-lg text-zinc-400">
          Athena analyzes your study habits, predicts what you will forget, protects your privacy,
          and recommends exactly what to learn next.
        </p>

        <div className="mt-12 flex gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl">
            <p className="text-sm text-zinc-400">Retention</p>
            <p className="text-3xl font-bold">92%</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl">
            <p className="text-sm text-zinc-400">Study Streak</p>
            <p className="text-3xl font-bold">14 Days</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl">
            <p className="text-sm text-zinc-400">Weak Topics</p>
            <p className="text-3xl font-bold">3</p>
          </div>
        </div>
      </section>
    </main>
  );
}
