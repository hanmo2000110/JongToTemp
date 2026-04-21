'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DailyMetric } from '@/lib/mock/dashboard';

type Props = {
  data: DailyMetric[];
};

export default function PostVolumeChart({ data }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-slate-900">게시글 수</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()}건`} />
            <Bar dataKey="postVolume" fill="#0f766e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
