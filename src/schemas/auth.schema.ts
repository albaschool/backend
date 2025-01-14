import { z } from "@/utils/ko-zod";

export const saveUserSchema = z.object({
  body: z.object({
    email: z.string().min(1).max(255),
    name: z.string().min(1).max(255),
    contact: z.string().regex(/^[01]\d{7,11}$/, "숫자만 포함한 전화번호 형식이어야 합니다."),
    password: z.string().min(1).max(255),
    role: z.string().min(5).max(7),
  }),
});

export const emailSendSchema = z.object({
  body: z.object({
    email: z.string().min(1).max(255),
  }),
});

export const passwordSchema = z.object({
  body: z.object({
    password: z.string().min(1).max(255),
  }),
});
