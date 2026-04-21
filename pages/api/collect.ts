import type { NextApiRequest, NextApiResponse } from 'next';
import { InMemoryCollectorRegistry, type CollectorAdapter } from '../../lib/server/collectors/types';
import { aggregateSentimentByDay } from '../../lib/server/daily/aggregateSentiment';
import { buildExecutionKey, InMemoryIdempotencyStore, withIdempotency, withRetry } from '../../lib/server/jobs/idempotency';
import { scoreRecordSentiment } from '../../lib/server/sentiment/ruleBased';

const idempotencyStore = new InMemoryIdempotencyStore();
const collectorRegistry = new InMemoryCollectorRegistry();

const noopCollector: CollectorAdapter = {
  source: 'noop',
  async collect() {
    return { records: [] };
  },
};

collectorRegistry.register(noopCollector);

const parseRequest = (req: NextApiRequest) => {
  const targetDate = String(req.query.target_date ?? req.body?.target_date ?? new Date().toISOString().slice(0, 10));
  const stockCode = String(req.query.stock_code ?? req.body?.stock_code ?? 'ALL');
  const source = String(req.query.source ?? req.body?.source ?? 'noop');
  return { targetDate, stockCode, source };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { targetDate, stockCode, source } = parseRequest(req);
  const key = buildExecutionKey('collect', targetDate, stockCode);

  const result = await withIdempotency({ key, store: idempotencyStore, ttlSeconds: 60 * 60 * 24 }, async () =>
    withRetry(
      async () => {
        const collector = collectorRegistry.get(source);
        const collected = await collector.collect({ targetDate, stockCode });
        const scores = collected.records.map(scoreRecordSentiment);
        const aggregate = aggregateSentimentByDay({ targetDate, stockCode, items: scores });

        return {
          source,
          collectedCount: collected.records.length,
          aggregate,
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
