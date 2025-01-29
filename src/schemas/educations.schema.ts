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
  file: z.object({
    img: z
      .custom<Express.Multer.File>()
      .refine((file) => file.size <= 1024 * 1024 * 5, "파일 크기는 5MB 이하여야 합니다.")
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype),
        "지원되는 이미지 형식은 jpg, png, webp입니다.",
      ),
  }),
});

export const updateEducationSchema = createEducationSchema.partial();
