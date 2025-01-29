import { Request, Response } from 'express';

import HttpException from '@/interfaces/http-exception.interface';
import * as services from "@/services/stores-edu.service"

export const getEducations = async (req: Request, res: Response) => {
  const isStoreMember = await services.isStoreMember(req.params.storeId, req.auth!.id);
  if (!isStoreMember) {
    throw new HttpException(403, "가게가 존재하지 않거나 가게에 소속되어 있지 않습니다.");
  }

  const educations = await services.getEducationsById(req.params.storeId);

  if (educations.length === 0) {
    res.status(404).json([]);
    return;
  }

  res.status(200).json(educations);
};
