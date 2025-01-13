import { z } from "@/utils/ko-zod";

export const storeIdParamsSchema = z.object({
  params: z.object({
    storeId: z.string().length(8),
  }),
});

export const scheduleIdParamsSchema = z.object({
  params: z.object({
    scheduleId: z.string().length(16),
  }),
});