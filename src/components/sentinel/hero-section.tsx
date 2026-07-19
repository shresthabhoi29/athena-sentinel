'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter, AnimatedGradient, ParticleField } from './animated-components';

export function HeroSection() {
  const stats = [
    { label: 'Retention', value: 78, suffix: '%' },
    { label: 'Study Streak', value: 24, suffix: ' days' },
    { label: 'Focus Time', value: 187, suffix: ' min' },
    { label: 'Weak Topics', value: 3, suffix: '' },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0A0A0C] to-[#1a1a2e] py-20">
      <AnimatedGradient />
      <ParticleField />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid items-center gap-12 lg:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-5xl font-bold text-transparent sm:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Good Evening,<br />Shrey.
            </motion.h1>

            <motion.p
              className="mt-6 text-lg text-zinc-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Athena has analyzed today's learning behavior.
            </motion.p>

            <motion.div
              className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 text-center"
                  whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.2)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                >
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative h-96"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent backdrop-blur-xl"
              animate={{
                boxShadow: [
                  '0 0 40px rgba(99, 102, 241, 0.2)',
                  '0 0 60px rgba(139, 92, 246, 0.3)',
                  '0 0 40px rgba(99, 102, 241, 0.2)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl"
                >
                  🎯
                </motion.div>
                <p className="mt-4 text-sm text-zinc-300">Energy Prediction</p>
                <p className="mt-2 text-2xl font-bold text-indigo-300">Peak at 8PM</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}