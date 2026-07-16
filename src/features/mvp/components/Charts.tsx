'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ChartDatum = {
  day?: string;
  hours?: number;
  value?: number;
  name?: string;
  fill?: string;
};

export function WeeklyHoursChart({ data }: { data: ChartDatum[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="studyHours" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#818CF8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#818CF8" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="day" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: '#09090B',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#fff',
            }}
          />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="#818CF8"
            fill="url(#studyHours)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyHoursBarChart({ data }: { data: ChartDatum[] }) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="day" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: '#09090B',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#fff',
            }}
          />
          <Bar dataKey="value" fill="#34D399" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubjectDistributionChart({ data }: { data: ChartDatum[] }) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill ?? '#818CF8'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#09090B',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
