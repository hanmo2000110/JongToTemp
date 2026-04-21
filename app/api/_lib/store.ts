import { randomUUID } from 'crypto';

type Stock = {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

type SentimentDaily = {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  score: number;
};

type PriceDaily = {
  date: string;
  close: number;
  changeRate: number;
};

type DashboardSummary = {
  avgSentimentScore: number;
  totalMentions: number;
  positiveRatio: number;
  periodReturnRate: number;
};

const stocks: Stock[] = [];
const sentimentByStockCode = new Map<string, SentimentDaily[]>();
const priceByStockCode = new Map<string, PriceDaily[]>();
const summaryByStockCode = new Map<string, DashboardSummary>();

function nowIso() {
  return new Date().toISOString();
}

export function listStocks() {
  return [...stocks].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function createStock(input: Omit<Stock, 'id' | 'createdAt' | 'updatedAt'>) {
  const item: Stock = {
    id: randomUUID(),
    ...input,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  stocks.push(item);
  return item;
}

export function getStockById(id: string) {
  return stocks.find((item) => item.id === id);
}

export function updateStockById(id: string, patch: Partial<Omit<Stock, 'id' | 'createdAt'>>) {
  const item = getStockById(id);
  if (!item) return null;
  Object.assign(item, patch, { updatedAt: nowIso() });
  return item;
}

export function deleteStockById(id: string) {
  const index = stocks.findIndex((item) => item.id === id);
  if (index < 0) return null;
  const [removed] = stocks.splice(index, 1);
  return removed;
}

export function reorderStocks(orders: Array<{ id: string; displayOrder: number }>) {
  const updated: Stock[] = [];
  for (const order of orders) {
    const item = getStockById(order.id);
    if (!item) continue;
    item.displayOrder = order.displayOrder;
    item.updatedAt = nowIso();
    updated.push(item);
  }
  return updated.sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getActiveStocks(stockCodes?: string[]) {
  const active = stocks.filter((stock) => stock.isActive);
  if (!stockCodes?.length) return active;
  return active.filter((stock) => stockCodes.includes(stock.code));
}

function generateDailyRows(days: number, seed: number) {
  return Array.from({ length: days }).map((_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (days - 1 - index));

    const positive = 30 + ((seed + index * 7) % 35);
    const neutral = 10 + ((seed + index * 5) % 20);
    const negative = 5 + ((seed + index * 3) % 15);
    const mentions = positive + neutral + negative;

    const score = Number(((positive - negative) / mentions).toFixed(4));
    const close = Number((100 + seed * 0.6 + index * 0.8 + (seed % 5)).toFixed(2));
    const changeRate = Number((Math.sin(index / 3) * 2.4).toFixed(2));

    return {
      date: date.toISOString().slice(0, 10),
      positive,
      neutral,
      negative,
      score,
      close,
      changeRate,
    };
  });
}

export function runCollectionForStocks(stockCodes?: string[]) {
  const targets = getActiveStocks(stockCodes);

  for (const stock of targets) {
    const seed = stock.code
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const generated = generateDailyRows(30, seed);
    const sentiments: SentimentDaily[] = generated.map(({ date, positive, neutral, negative, score }) => ({
      date,
      positive,
      neutral,
      negative,
      score,
    }));
    const prices: PriceDaily[] = generated.map(({ date, close, changeRate }) => ({
      date,
      close,
      changeRate,
    }));

    const mentions = sentiments.reduce((sum, row) => sum + row.positive + row.neutral + row.negative, 0);
    const positiveSum = sentiments.reduce((sum, row) => sum + row.positive, 0);
    const scoreAvg = sentiments.reduce((sum, row) => sum + row.score, 0) / sentiments.length;
    const periodReturnRate = Number(
      (((prices[prices.length - 1].close - prices[0].close) / prices[0].close) * 100).toFixed(2),
    );

    sentimentByStockCode.set(stock.code, sentiments);
    priceByStockCode.set(stock.code, prices);
    summaryByStockCode.set(stock.code, {
      avgSentimentScore: Number(scoreAvg.toFixed(4)),
      totalMentions: mentions,
      positiveRatio: Number((positiveSum / mentions).toFixed(4)),
      periodReturnRate,
    });
  }

  return targets.map((item) => item.code);
}

export function getDashboardData(stockCode: string, days: 14 | 30) {
  const sentiment = sentimentByStockCode.get(stockCode) ?? [];
  const prices = priceByStockCode.get(stockCode) ?? [];
  const summary =
    summaryByStockCode.get(stockCode) ??
    ({
      avgSentimentScore: 0,
      totalMentions: 0,
      positiveRatio: 0,
      periodReturnRate: 0,
    } satisfies DashboardSummary);

  return {
    daily_sentiment: sentiment.slice(-days),
    daily_price: prices.slice(-days),
    summary_metrics: summary,
  };
}
