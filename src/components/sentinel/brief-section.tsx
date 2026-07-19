'use client';

import { motion } from 'framer-motion';
import { mockBriefInsights } from './mock-data';

export function BriefSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#0A0A0C] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">AI Daily Brief</h2>
          <p className="mt-2 text-zinc-400">Personalized insights from your learning data</p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {mockBriefInsights.map((insight) => (
            <motion.div
              key={insight.id}
              variants={item}
              className="group glass relative overflow-hidden rounded-2xl border border-white/10 p-6 backdrop-blur-xl"
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="text-4xl">{insight.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-white">{insight.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{insight.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}