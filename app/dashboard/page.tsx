'use client';

import { useMemo, useState } from 'react';
import PostVolumeChart from '@/components/charts/PostVolumeChart';
import PriceChart from '@/components/charts/PriceChart';
import SentimentIndexChart from '@/components/charts/SentimentIndexChart';
import SentimentRatioChart from '@/components/charts/SentimentRatioChart';
import { marketSeriesByStock, stockItems } from '@/lib/mock/dashboard';

const cardStyle = 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm';

export default function DashboardPage() {
  const initialCode = stockItems.find((item) => item.active)?.code ?? stockItems[0]?.code ?? '005930';
  const [selectedCode, setSelectedCode] = useState(initialCode);

  const series = useMemo(() => marketSeriesByStock[selectedCode] ?? [], [selectedCode]);

  const summary = useMemo(() => {
    if (series.length === 0) {
      return { avgNegative14: 0, change3d: 0, avgPostVolume: 0, latestSentiment: 0 };
    }

    const avgNegative14 = series.reduce((sum, row) => sum + row.negativeRatio, 0) / series.length;
    const recent = series.slice(-3);
    const older = series.slice(-6, -3);
    const recentAvg = recent.reduce((sum, row) => sum + row.negativeRatio, 0) / (recent.length || 1);
    const olderAvg = older.reduce((sum, row) => sum + row.negativeRatio, 0) / (older.length || 1);
    const change3d = recentAvg - olderAvg;
    const avgPostVolume = series.reduce((sum, row) => sum + row.postVolume, 0) / series.length;
    const latestSentiment = series[series.length - 1]?.sentimentIndex ?? 0;

    return { avgNegative14, change3d, avgPostVolume, latestSentiment };
  }, [series]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="stockSelect" className="mb-2 block text-sm font-medium text-slate-700">
          종목 선택
        </label>
        <select
          id="stockSelect"
          value={selectedCode}
          onChange={(event) => setSelectedCode(event.target.value)}
          className="h-11 w-full rounded-lg border border-slate-300 px-3 text-base focus:border-blue-500 focus:outline-none"
        >
          {stockItems.map((item) => (
            <option key={item.id} value={item.code}>
              {item.name} ({item.code})
            </option>
          ))}
        </select>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className={cardStyle}>
          <h2 className="text-sm text-slate-500">14일 평균 부정비율</h2>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.avgNegative14.toFixed(1)}%</p>
        </article>
        <article className={cardStyle}>
          <h2 className="text-sm text-slate-500">3일 변화</h2>
          <p className={`mt-2 text-2xl font-bold ${summary.change3d <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {summary.change3d > 0 ? '+' : ''}
            {summary.change3d.toFixed(1)}%p
          </p>
        </article>
        <article className={cardStyle}>
          <h2 className="text-sm text-slate-500">평균 게시글 수</h2>
          <p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(summary.avgPostVolume).toLocaleString()}건</p>
        </article>
        <article className={cardStyle}>
          <h2 className="text-sm text-slate-500">최신 감성지수</h2>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.latestSentiment}점</p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PriceChart data={series} />
        <SentimentRatioChart data={series} />
        <PostVolumeChart data={series} />
        <SentimentIndexChart data={series} />
      </section>
    </main>
  );
}
