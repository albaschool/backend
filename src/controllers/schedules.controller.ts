import { Request, Response } from "express";

import HttpException from "@/interfaces/http-exception.interface";
import * as services from "@/services/schedules.service";

export const getSchedulesByUser = async (req: Request, res: Response) => {
  const schedules = await services.getSchedulesByUser(req.auth!.id);

  if (schedules.length === 0) {
    res.status(404).json([]);
    return;
  }

  res.status(200).json(schedules);
}

export const getSchedulesByStore = async (req: Request, res: Response) => {
  const isUserInStore = await services.isUserInStore(req.auth!.id, req.params.storeId);
  if (!isUserInStore) {
    throw new HttpException(403, "가게에 소속되어 있지 않습니다.");
  }

  const schedules = await services.getSchedulesByStore(req.params.storeId);

  if (schedules.length === 0) {
    res.status(404).json([]);
    return;
  }

  res.status(200).json(schedules);
}