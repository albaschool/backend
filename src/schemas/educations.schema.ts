import { z } from "@/utils/ko-zod";

export const eduIdParamsSchema = z.object({
  params: z.object({
    eduId: z.string().length(12),
  }),
});

export const createEducationSchema = z.object({
  body: z.object({
    title: z.string(),
    content: z.string(),
  }),
});

export const updateEducationSchema = createEducationSchema.partial();
