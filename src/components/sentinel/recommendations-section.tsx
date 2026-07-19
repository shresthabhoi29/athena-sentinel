'use client';

import { motion } from 'framer-motion';
import { mockRecommendations } from './mock-data';

export function RecommendationsSection() {
  const priorityColors = {
    Critical: 'from-red-500/20 to-red-500/5 border-red-500/30',
    High: 'from-orange-500/20 to-orange-500/5 border-orange-500/30',
    Medium: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
    Low: 'from-green-500/20 to-green-500/5 border-green-500/30',
  };

  const priorityTextColors = {
    Critical: 'text-red-400',
    High: 'text-orange-400',
    Medium: 'text-yellow-400',
    Low: 'text-green-400',
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0A0C] to-[#1a1a2e] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">AI Recommendations</h2>
          <p className="mt-2 text-zinc-400">Personalized study plan optimized for your learning style</p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 lg:grid-cols-2"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {mockRecommendations.map((rec) => (
            <motion.div
              key={rec.id}
              variants={item}
              className={`glass relative overflow-hidden rounded-2xl border p-6 backdrop-blur-lg ${priorityColors[rec.priority as keyof typeof priorityColors]}`}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity hover:opacity-100" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{rec.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                        <p className="text-sm text-zinc-400">{rec.subject}</p>
                      </div>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityTextColors[rec.priority as keyof typeof priorityTextColors]}`}>
                    {rec.priority}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500">Estimated Time</p>
                    <p className="mt-1 font-semibold text-white">{rec.estimatedTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Improvement</p>
                    <p className="mt-1 font-semibold text-indigo-400">{rec.expectedImprovement}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Difficulty</p>
                    <p className="mt-1 font-semibold text-white">{rec.difficulty}</p>
                  </div>
                </div>

                <button className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/30">
                  Start Learning
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}