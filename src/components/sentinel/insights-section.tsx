'use client';

import { motion } from 'framer-motion';
import { mockSpotifyInsights } from './mock-data';

export function InsightsSection() {
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
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#0A0A0C] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Your Learning Wrapped</h2>
          <p className="mt-2 text-zinc-400">Spotify-style insights into your study patterns</p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {mockSpotifyInsights.map((insight) => (
            <motion.div
              key={insight.id}
              variants={item}
              className={`glass relative overflow-hidden rounded-2xl border border-white/10 p-8 backdrop-blur-lg bg-gradient-to-br ${insight.color}`}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity hover:opacity-100" />
              <div className="relative">
                <div className="text-5xl">{insight.icon}</div>
                <p className="mt-6 text-2xl font-bold text-white">{insight.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}