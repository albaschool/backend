import { z } from "@/utils/ko-zod";

export const createStoreSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    location: z.string().min(1).max(255),
    contact: z.string().regex(/^[01]\d{7,11}$/, "숫자만 포함한 전화번호 형식이어야 합니다."),
    password: z.string().min(1).max(255),
    openTime: z
      .string()
      .regex(/^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "HH:mm:ss 혹은 HH:mm 형식이어야 합니다."),
    closeTime: z
      .string()
      .regex(/^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "HH:mm:ss 혹은 HH:mm 형식이어야 합니다."),
  }),
});
