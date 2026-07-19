'use client';

import { motion } from 'framer-motion';
import { mockTimelineEvents } from './mock-data';

export function TimelineSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#0A0A0C] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Learning Timeline</h2>
          <p className="mt-2 text-zinc-400">Your journey tracked in real-time</p>
        </motion.div>

        <motion.div
          className="mt-12 space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {mockTimelineEvents.map((event, index) => (
            <motion.div key={event.id} variants={itemVariants} className="flex gap-6">
              <div className="relative flex flex-col items-center">
                <motion.div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                  whileHover={{ scale: 1.1 }}
                >
                  {event.icon}
                </motion.div>
                {index !== mockTimelineEvents.length - 1 && (
                  <motion.div
                    className="mt-2 h-12 w-1 bg-gradient-to-b from-indigo-500/50 to-transparent"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                )}
              </div>
              <motion.div
                className={`glass flex-1 rounded-xl border border-white/10 p-4 backdrop-blur-lg ${event.color} relative overflow-hidden`}
                whileHover={{ x: 8, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.2)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 transition-opacity hover:opacity-100" />
                <div className="relative">
                  <h3 className="font-semibold text-white">{event.title}</h3>
                  {event.subtitle && <p className="mt-1 text-sm text-zinc-400">{event.subtitle}</p>}
                  <p className="mt-2 text-xs text-zinc-500">{event.timestamp}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}