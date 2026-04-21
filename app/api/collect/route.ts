import { errorResponse, ok, withErrorHandling } from '../_lib/http';
import { getActiveStocks, runCollectionForStocks } from '../_lib/store';
import { collectRequestSchema } from '../_lib/validation';

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json().catch(() => undefined);
  const parsed = collectRequestSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(400, 'BAD_REQUEST', 'Invalid request body', parsed.error.flatten());
  }

  const targetStocks = getActiveStocks(parsed.data?.stockCodes);
  if (targetStocks.length === 0) {
    return errorResponse(404, 'NOT_FOUND', 'No active stocks found for collection');
  }

  const collectedCodes = runCollectionForStocks(parsed.data?.stockCodes);

  return ok({
    collected: collectedCodes.length,
    stockCodes: collectedCodes,
    message: 'Collection, sentiment analysis, save, and aggregation update completed.',
  });
});
