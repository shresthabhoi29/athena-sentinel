'use client';

import { motion } from 'framer-motion';
import { ProgressRing, GlassmorphicCard } from './animated-components';
import { mockMemoryCards } from './mock-data';

export function MemoryCardsSection() {
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
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0A0C] to-[#1a1a2e] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Memory & Performance Cards</h2>
          <p className="mt-2 text-zinc-400">Real-time insights into your learning patterns</p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {mockMemoryCards.map((card) => (
            <motion.div key={card.id} variants={item}>
              <GlassmorphicCard>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-3xl">{card.icon}</div>
                    <h3 className="mt-3 text-lg font-semibold text-white">{card.title}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{card.description}</p>
                    {typeof card.value === 'number' ? (
                      <p className="mt-4 text-2xl font-bold text-indigo-400">{card.value}</p>
                    ) : (
                      <p className="mt-4 text-lg font-semibold text-indigo-400">{card.value}</p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <ProgressRing percentage={card.progress} />
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}