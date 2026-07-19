'use client';

import { AlertTriangle, Brain, Target, TrendingUp } from 'lucide-react';

import { motion } from 'framer-motion';

const cards = [
  {
    title: 'Highest Priority',
    value: 'Electrostatics',
    subtitle: '94% chance of forgetting today',
    icon: AlertTriangle,
    color: 'from-red-500/20 to-red-700/10',
  },
  {
    title: 'Quick Win',
    value: '5 PYQs',
    subtitle: 'Current Electricity',
    icon: Target,
    color: 'from-emerald-500/20 to-green-700/10',
  },
  {
    title: 'Mastery',
    value: '+7%',
    subtitle: 'Calculus improved this week',
    icon: TrendingUp,
    color: 'from-cyan-500/20 to-blue-700/10',
  },
  {
    title: 'Focus Window',
    value: '9:30 - 11:00',
    subtitle: 'Predicted peak concentration',
    icon: Brain,
    color: 'from-violet-500/20 to-indigo-700/10',
  },
];

export default function AIDailyBriefing() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="mb-10">
          <p className="font-medium text-cyan-400">Present AI Analysis</p>

          <h2 className="mt-2 text-4xl font-bold text-white">
            Athena has analyzed your study behaviour.
          </h2>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Based on previous sessions, memory retention, revision history and productivity trends,
            these are the smartest actions right now.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.12,
                  duration: 0.5,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                className={`rounded-3xl border border-white/10 bg-gradient-to-br ${card.color} p-6 backdrop-blur-xl`}
              >
                <Icon className="mb-6 h-8 w-8 text-cyan-400" />

                <p className="text-sm text-zinc-400">{card.title}</p>

                <h3 className="mt-2 text-2xl font-bold text-white">{card.value}</h3>

                <p className="mt-2 text-sm text-zinc-300">{card.subtitle}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
