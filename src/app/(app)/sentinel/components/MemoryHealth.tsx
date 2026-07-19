'use client';

import { motion } from 'framer-motion';

const topics = [
  { name: 'Electrostatics', value: 42, color: 'bg-red-500' },
  { name: 'Matrices', value: 81, color: 'bg-cyan-500' },
  { name: 'Chemical Bonding', value: 65, color: 'bg-yellow-500' },
  { name: 'Current Electricity', value: 91, color: 'bg-green-500' },
];

export default function MemoryHealth() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <h2 className="text-3xl font-bold">🧠 Memory Health</h2>

      <p className="mt-2 text-zinc-400">
        Athena predicts which concepts are most likely to fade next.
      </p>

      <div className="mt-8 space-y-6">
        {topics.map((topic) => (
          <div key={topic.name}>
            <div className="mb-2 flex justify-between text-sm">
              <span>{topic.name}</span>
              <span>{topic.value}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${topic.value}%` }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className={`h-full rounded-full ${topic.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
