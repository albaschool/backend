import { z } from "@/utils/ko-zod";

export const userIdParamsSchema = z.object({
  params: z.object({
    userId: z.string().length(8),
  }),
});

export const storeIdParamsSchema = z.object({
  params: z.object({
    storeId: z.string().length(8),
  }),
});

export const scheduleIdParamsSchema = z.object({
  params: z.object({
    scheduleId: z.string().length(12),
  }),
});
