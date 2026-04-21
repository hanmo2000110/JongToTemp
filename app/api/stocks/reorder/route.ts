import { errorResponse, ok, withErrorHandling } from '../../_lib/http';
import { getStockById, reorderStocks } from '../../_lib/store';
import { reorderStocksSchema } from '../../_lib/validation';

export const PATCH = withErrorHandling(async (request: Request) => {
  const body = await request.json();
  const parsed = reorderStocksSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(400, 'BAD_REQUEST', 'Invalid request body', parsed.error.flatten());
  }

  const missingId = parsed.data.orders.find((item) => !getStockById(item.id));
  if (missingId) {
    return errorResponse(404, 'NOT_FOUND', `Stock not found: ${missingId.id}`);
  }

  const updated = reorderStocks(parsed.data.orders);
  return ok({ stocks: updated });
});
