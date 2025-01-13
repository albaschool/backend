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

export const createScheduleBodySchema = z.object({
  body: z.object({
    userId: z.string().length(12),
    storeId: z.string().length(8),
    dayOfWeek: z.number().int().min(0).max(7),
    content: z.string(),
    startTime: z
      .string()
      .regex(/^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "HH:mm:ss 혹은 HH:mm 형식이어야 합니다."),
    endTime: z
      .string()
      .regex(/^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "HH:mm:ss 혹은 HH:mm 형식이어야 합니다."),
  }),
});
