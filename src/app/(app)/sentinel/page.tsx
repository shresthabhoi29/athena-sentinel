'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '92%', label: 'Retention' },
  { value: '14', label: 'Day Streak' },
  { value: '3', label: 'Weak Topics' },
  { value: '98', label: 'AI Confidence' },
];

export default function SentinelPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05060A] text-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute top-40 right-10 h-96 w-96 rounded-full bg-violet-500/20 blur-[150px]" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300"
        >
          Athena Sentinel
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center text-6xl leading-tight font-black md:text-8xl"
        >
          The AI Study
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500 bg-clip-text text-transparent">
            Guardian
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 max-w-3xl text-center text-xl text-zinc-400"
        >
          Predicts forgetting before it happens, protects your privacy, tracks mastery, and tells
          you exactly what to study next.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid w-full max-w-5xl gap-6 md:grid-cols-4"
        >
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
            >
              <h2 className="text-5xl font-bold">{item.value}</h2>
              <p className="mt-2 text-zinc-400">{item.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Placeholder so we know the page compiles */}
        <div className="mt-20 w-full max-w-6xl rounded-3xl border border-cyan-500/20 bg-white/5 p-10 backdrop-blur-xl">
          <p className="font-semibold text-cyan-400">Present AI Analysis</p>

          <h2 className="mt-2 text-3xl font-bold">Athena has analyzed study pattern for today.</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Highest Priority', 'Electrostatics'],
              ['Quick Win', '5 PYQs'],
              ['Mastery', '+7%'],
              ['Focus Window', '9:30–11:00'],
            ].map(([title, value]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p className="text-sm text-zinc-400">{title}</p>
                <h3 className="mt-3 text-xl font-bold">{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
