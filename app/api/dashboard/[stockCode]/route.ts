import { errorResponse, ok, withErrorHandling } from '../../_lib/http';
import { getDashboardData, getActiveStocks } from '../../_lib/store';
import { dashboardParamSchema, dashboardQuerySchema } from '../../_lib/validation';

type RouteContext = {
  params: Promise<{ stockCode: string }>;
};

export const GET = withErrorHandling(async (request: Request, context: RouteContext) => {
  const { stockCode } = await context.params;
  const paramParsed = dashboardParamSchema.safeParse({ stockCode });
  if (!paramParsed.success) {
    return errorResponse(400, 'BAD_REQUEST', 'Invalid stock code', paramParsed.error.flatten());
  }

  const url = new URL(request.url);
  const queryParsed = dashboardQuerySchema.safeParse({
    range: url.searchParams.get('range') ?? '14d',
  });
  if (!queryParsed.success) {
    return errorResponse(400, 'BAD_REQUEST', 'Invalid range parameter', queryParsed.error.flatten());
  }

  const exists = getActiveStocks().some((item) => item.code === stockCode);
  if (!exists) {
    return errorResponse(404, 'NOT_FOUND', 'Stock not found or inactive');
  }

  const days = queryParsed.data.range === '30d' ? 30 : 14;
  const data = getDashboardData(stockCode, days);

  return ok({
    stockCode,
    range: queryParsed.data.range,
    ...data,
  });
});
