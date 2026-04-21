import { errorResponse, ok, withErrorHandling } from '../../_lib/http';
import { deleteStockById, getStockById, updateStockById } from '../../_lib/store';
import { stockIdParamSchema, updateStockSchema } from '../../_lib/validation';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const PATCH = withErrorHandling(async (request: Request, context: RouteContext) => {
  const { id } = await context.params;
  const paramsParsed = stockIdParamSchema.safeParse({ id });

  if (!paramsParsed.success) {
    return errorResponse(400, 'BAD_REQUEST', 'Invalid stock id', paramsParsed.error.flatten());
  }

  const body = await request.json();
  const parsed = updateStockSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, 'BAD_REQUEST', 'Invalid request body', parsed.error.flatten());
  }

  const target = getStockById(id);
  if (!target) {
    return errorResponse(404, 'NOT_FOUND', 'Stock not found');
  }

  const updated = updateStockById(id, parsed.data);
  return ok({ stock: updated });
});

export const DELETE = withErrorHandling(async (_request: Request, context: RouteContext) => {
  const { id } = await context.params;
  const paramsParsed = stockIdParamSchema.safeParse({ id });

  if (!paramsParsed.success) {
    return errorResponse(400, 'BAD_REQUEST', 'Invalid stock id', paramsParsed.error.flatten());
  }

  const removed = deleteStockById(id);
  if (!removed) {
    return errorResponse(404, 'NOT_FOUND', 'Stock not found');
  }

  return ok({ deletedId: id });
});
