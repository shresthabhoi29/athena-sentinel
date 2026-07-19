'use client';

import { motion } from 'framer-motion';
import { privacyFeatures } from './mock-data';

export function PrivacySection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0A0C] to-[#1a1a2e] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div className="rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent p-8 sm:p-12 lg:p-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Your Privacy, Protected</h2>
            <p className="mt-4 text-lg text-zinc-300">Athena prioritizes your data security and privacy with enterprise-grade encryption.</p>
          </motion.div>

          <motion.div
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {privacyFeatures.map((feature) => (
              <motion.div key={feature.id} variants={item} className="flex items-center gap-3 rounded-lg bg-white/5 p-4 backdrop-blur">
                <span className="text-2xl">{feature.icon}</span>
                <span className="font-semibold text-green-300">{feature.feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}