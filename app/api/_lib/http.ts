import { NextResponse } from 'next/server';

export type ErrorCode = 'BAD_REQUEST' | 'NOT_FOUND' | 'INTERNAL_ERROR';

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, { status: 200, ...init });
}

export function created<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, { status: 201, ...init });
}

export function errorResponse(
  status: 400 | 404 | 500,
  code: ErrorCode,
  message: string,
  details?: unknown,
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status },
  );
}

export function withErrorHandling<TArgs extends unknown[]>(
  handler: (...args: TArgs) => Promise<NextResponse>,
) {
  return async (...args: TArgs) => {
    try {
      return await handler(...args);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown server error';
      return errorResponse(500, 'INTERNAL_ERROR', message);
    }
  };
}
