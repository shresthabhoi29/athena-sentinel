'use client';

import { motion } from 'framer-motion';
import { mockHeatmapData } from './mock-data';

export function HeatmapSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0A0C] to-[#1a1a2e] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Knowledge Heatmap</h2>
          <p className="mt-2 text-zinc-400">Your mastery across all subjects and chapters</p>
        </motion.div>

        <motion.div
          className="mt-12 space-y-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {mockHeatmapData.map((subject) => (
            <motion.div key={subject.subject} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h3 className="text-lg font-semibold text-white">{subject.subject}</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {subject.chapters.map((chapter, idx) => (
                  <motion.div
                    key={chapter.name}
                    className="glass group relative overflow-hidden rounded-lg border border-white/10 p-3 backdrop-blur-lg"
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.2)' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className={`absolute inset-0 ${chapter.color} opacity-0 transition-opacity group-hover:opacity-20`} />
                    <div className="relative">
                      <p className="text-xs font-semibold text-white">{chapter.name}</p>
                      <div className="mt-2 flex items-end gap-1">
                        <div className="flex-1 space-y-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className={`h-1 rounded-full ${
                                i < Math.ceil((chapter.confidence / 100) * 5) ? chapter.color : 'bg-white/10'
                              }`}
                              initial={{ scaleX: 0 }}
                              whileInView={{ scaleX: 1 }}
                              transition={{ delay: i * 0.05 }}
                              viewport={{ once: true }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-zinc-400">{chapter.confidence}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}