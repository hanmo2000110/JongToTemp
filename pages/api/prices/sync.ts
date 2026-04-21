import type { NextApiRequest, NextApiResponse } from 'next';
import { buildExecutionKey, InMemoryIdempotencyStore, withIdempotency, withRetry } from '../../../lib/server/jobs/idempotency';
import { syncDailyPrices } from '../../../lib/server/prices/syncDailyPrices';
import type { PriceSyncAdapter } from '../../../lib/server/prices/types';

const idempotencyStore = new InMemoryIdempotencyStore();

const noopPriceAdapter: PriceSyncAdapter = {
  source: 'noop',
  async syncDailyCandles({ targetDate, stockCode }) {
    return [
      {
        stockCode,
        date: targetDate,
        open: 100,
        high: 110,
        low: 95,
        close: 105,
        volume: 10000,
      },
    ];
  },
};

const parseRequest = (req: NextApiRequest) => {
  const targetDate = String(req.query.target_date ?? req.body?.target_date ?? new Date().toISOString().slice(0, 10));
  const stockCode = String(req.query.stock_code ?? req.body?.stock_code ?? 'ALL');
  return { targetDate, stockCode };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { targetDate, stockCode } = parseRequest(req);
  const key = buildExecutionKey('prices_sync', targetDate, stockCode);

  const result = await withIdempotency({ key, store: idempotencyStore, ttlSeconds: 60 * 60 * 24 }, async () =>
    withRetry(
      async () => {
        const synced = await syncDailyPrices({
          targetDate,
          stockCode,
          adapter: noopPriceAdapter,
          save: async () => undefined,
        });

        return {
          stockCode,
          targetDate,
          rows: synced.length,
          last: synced.at(-1) ?? null,
        };
      },
      { retries: 2, delayMs: 600 },
    ),
  );

  if (result.skipped) {
    return res.status(202).json({ skipped: true, key });
  }

  return res.status(200).json({ skipped: false, key, data: result.result });
}
