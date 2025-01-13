import { z } from "@/utils/ko-zod";

export const createStoreSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    location: z.string().min(1).max(255),
    contact: z.string().regex(/^[01]\d{7,11}$/, "숫자만 포함한 전화번호 형식이어야 합니다."),
    password: z.string().min(1).max(255),
  }),
});


