import { created, errorResponse, ok, withErrorHandling } from '../_lib/http';
import { createStock, listStocks } from '../_lib/store';
import { createStockSchema } from '../_lib/validation';

export const GET = withErrorHandling(async () => {
  return ok({ stocks: listStocks() });
});

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json();
  const parsed = createStockSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(400, 'BAD_REQUEST', 'Invalid request body', parsed.error.flatten());
  }

  const stock = createStock(parsed.data);
  return created({ stock });
});
