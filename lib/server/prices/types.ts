export type DailyPriceCandle = {
  stockCode: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type EnrichedDailyPrice = DailyPriceCandle & {
  ma5: number | null;
  ma20: number | null;
};

export interface PriceSyncAdapter {
  source: string;
  syncDailyCandles(params: { targetDate: string; stockCode: string }): Promise<DailyPriceCandle[]>;
}
