'use client';

import { motion } from 'framer-motion';

export default function AIDailyBriefing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-10 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1220] to-[#111827] p-8 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm tracking-widest text-cyan-400 uppercase">AI Daily Briefing</p>

          <h2 className="mt-2 text-3xl font-bold">Good Morning, Shrey 👋</h2>

          <p className="mt-2 text-zinc-400">
            Athena analyzed your learning history and generated recommendations for today.
          </p>
        </div>

        <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-300">
          Updated 2 mins ago
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-sm text-zinc-400">🎯 Priority Revision</h3>

          <ul className="mt-4 space-y-2">
            <li>• Electrostatics</li>
            <li>• Matrices</li>
            <li>• Chemical Bonding</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-sm text-zinc-400">🧠 Memory Forecast</h3>

          <p className="mt-4 text-5xl font-bold text-cyan-400">82%</p>

          <p className="mt-2 text-sm text-zinc-400">Predicted retention after present revision.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-sm text-zinc-400">⚡ Next Best Action</h3>

          <p className="mt-4">
            Spend <span className="font-bold text-cyan-400">32 minutes</span> reviewing
            Electrostatics before attempting mixed PYQs.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
