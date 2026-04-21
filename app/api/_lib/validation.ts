import { z } from 'zod';

const allowedRange = ['14d', '30d'] as const;

export const stockBaseSchema = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(1),
  isActive: z.boolean().default(true),
});

export const createStockSchema = stockBaseSchema.extend({
  displayOrder: z.number().int().nonnegative(),
});

export const updateStockSchema = stockBaseSchema.partial().extend({
  displayOrder: z.number().int().nonnegative().optional(),
});

export const reorderStocksSchema = z.object({
  orders: z
    .array(
      z.object({
        id: z.string().uuid(),
        displayOrder: z.number().int().nonnegative(),
      }),
    )
    .min(1),
});

export const stockIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const dashboardParamSchema = z.object({
  stockCode: z.string().trim().min(1),
});

export const dashboardQuerySchema = z.object({
  range: z.enum(allowedRange).default('14d'),
});

export const collectRequestSchema = z
  .object({
    stockCodes: z.array(z.string().trim().min(1)).optional(),
  })
  .optional();
