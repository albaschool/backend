import { Request, Response } from "express";

import HttpException from "@/interfaces/http-exception.interface";
import logger from "@/logger";
import * as services from "@/services/validate.service";
import { z } from "@/utils/ko-zod";

export const validateBizRegistrationNum = async (req: Request, res: Response) => {
  const bizRegistrationNum: string = req.body.bizRegistrationNum ?? "";
  const schema = z.string().regex(/^\d{10}$/);

  try {
    schema.parse(bizRegistrationNum);
  } catch {
    throw new HttpException(400, "사업자 등록번호가 올바르지 않습니다.");
  }

  try {
    const result = await services.validateBizRegistrationNum(bizRegistrationNum);
    if (!result) {
      throw new HttpException(400, "국세청에 등록되지 않은 사업자 등록번호입니다.");
    }

    const encrypted = services.encrypt(bizRegistrationNum);
    res.status(200).json({ value: encrypted });
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    logger.error(error);
    throw new HttpException(500, "사업자 등록번호 검증 중 오류가 발생했습니다.");
  }
};
