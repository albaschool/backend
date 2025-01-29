import { z } from "@/utils/ko-zod";

export const eduIdParamsSchema = z.object({
  params: z.object({
    eduId: z.string().length(12),
  }),
});