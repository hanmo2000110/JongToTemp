import type { DailyPriceCandle, EnrichedDailyPrice, PriceSyncAdapter } from './types';

const average = (values: number[]): number =>
  Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(3));

export const calculateMovingAverages = (candles: DailyPriceCandle[]): EnrichedDailyPrice[] => {
  const sorted = [...candles].sort((a, b) => a.date.localeCompare(b.date));

  return sorted.map((candle, index) => {
    const closes = sorted.slice(0, index + 1).map((it) => it.close);
    const ma5 = closes.length >= 5 ? average(closes.slice(-5)) : null;
    const ma20 = closes.length >= 20 ? average(closes.slice(-20)) : null;

    return {
      ...candle,
      ma5,
      ma20,
    };
  });
};

export const syncDailyPrices = async (params: {
  targetDate: string;
  stockCode: string;
  adapter: PriceSyncAdapter;
  save: (rows: EnrichedDailyPrice[]) => Promise<void>;
}): Promise<EnrichedDailyPrice[]> => {
  const candles = await params.adapter.syncDailyCandles({
    targetDate: params.targetDate,
    stockCode: params.stockCode,
  });

  const enriched = calculateMovingAverages(candles);
  await params.save(enriched);
  return enriched;
};
