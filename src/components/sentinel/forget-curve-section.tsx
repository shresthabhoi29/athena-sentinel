'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockForgetCurveData } from './mock-data';

export function ForgetCurveSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#0A0A0C] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Forgetting Curve & Retention</h2>
          <p className="mt-2 text-zinc-400">Spaced repetition recommendations based on Ebbinghaus curve</p>
        </motion.div>

        <motion.div
          className="glass mt-12 rounded-2xl border border-white/10 p-6 backdrop-blur-lg sm:p-8 lg:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockForgetCurveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 12, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'white' }}
              />
              <Line
                type="monotone"
                dataKey="retention"
                stroke="url(#colorRetention)"
                strokeWidth={3}
                dot={false}
                isAnimationActive={true}
              />
              <defs>
                <linearGradient id="colorRetention" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgb(99, 102, 241)" />
                  <stop offset="100%" stopColor="rgb(139, 92, 246)" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-sm text-zinc-400">Current Retention</p>
              <p className="mt-2 text-2xl font-bold text-indigo-400">78%</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-sm text-zinc-400">7-Day Prediction</p>
              <p className="mt-2 text-2xl font-bold text-purple-400">28%</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <p className="text-sm text-zinc-400">Best Review Time</p>
              <p className="mt-2 text-2xl font-bold text-pink-400">Day 3</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}