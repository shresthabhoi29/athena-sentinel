'use client';

import { motion } from 'framer-motion';

export default function PredictionRadar() {
  const score = 98;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="mt-12 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#09111f] to-[#111827] p-8 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm tracking-widest text-cyan-400 uppercase">AI Prediction Engine</p>

          <h2 className="mt-2 text-3xl font-bold">Learning Risk Radar</h2>

          <p className="mt-2 text-zinc-400">
            Athena predicts performance using revision frequency, forgetting curves and consistency.
          </p>
        </div>

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: 'linear',
          }}
          className="relative h-44 w-44"
        >
          <svg viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" stroke="#1f2937" strokeWidth="10" fill="none" />

            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#22d3ee"
              strokeWidth="10"
              fill="none"
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * score) / 100}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-5xl font-black">{score}%</h1>
            <p className="text-xs text-zinc-400">Confidence</p>
          </div>
        </motion.div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white/5 p-5">
          <p className="text-sm text-zinc-400">Burnout Risk</p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">Low</h2>
        </div>

        <div className="rounded-2xl bg-white/5 p-5">
          <p className="text-sm text-zinc-400">Predicted JEE Readiness</p>

          <h2 className="mt-2 text-3xl font-bold text-cyan-400">87%</h2>
        </div>

        <div className="rounded-2xl bg-white/5 p-5">
          <p className="text-sm text-zinc-400">Memory Stability</p>

          <h2 className="mt-2 text-3xl font-bold text-violet-400">Excellent</h2>
        </div>
      </div>
    </motion.div>
  );
}
