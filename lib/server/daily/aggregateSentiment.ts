import type { EmotionTag, ScoredSentiment, SentimentLabel } from '../sentiment/ruleBased';

export type DailySentimentAggregate = {
  targetDate: string;
  stockCode: string;
  counts: Record<SentimentLabel, number>;
  total: number;
  ratios: Record<SentimentLabel, number>;
  sentimentIndex: number;
  averageScore: number;
  topEmotions: Array<{ tag: EmotionTag; count: number }>;
};

const ratio = (value: number, total: number): number =>
  total === 0 ? 0 : Number((value / total).toFixed(4));

/**
 * sentimentIndex: [-100, 100]
 * ((positive - negative) / total) * 100
 */
export const aggregateSentimentByDay = (
  params: {
    targetDate: string;
    stockCode: string;
    items: ScoredSentiment[];
  },
): DailySentimentAggregate => {
  const counts: Record<SentimentLabel, number> = {
    positive: 0,
    negative: 0,
    neutral: 0,
  };

  let scoreSum = 0;
  const emotionMap = new Map<EmotionTag, number>();

  for (const item of params.items) {
    counts[item.label] += 1;
    scoreSum += item.score;

    for (const tag of item.emotionTags ?? []) {
      emotionMap.set(tag, (emotionMap.get(tag) ?? 0) + 1);
    }
  }

  const total = params.items.length;
  const ratios = {
    positive: ratio(counts.positive, total),
    negative: ratio(counts.negative, total),
    neutral: ratio(counts.neutral, total),
  };

  const sentimentIndex = total
    ? Number((((counts.positive - counts.negative) / total) * 100).toFixed(2))
    : 0;

  const topEmotions = [...emotionMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  return {
    targetDate: params.targetDate,
    stockCode: params.stockCode,
    counts,
    total,
    ratios,
    sentimentIndex,
    averageScore: total ? Number((scoreSum / total).toFixed(3)) : 0,
    topEmotions,
  };
};
