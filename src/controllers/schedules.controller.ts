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
};

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
};

export const createSchedule = async (req: Request, res: Response) => {
  const result = await services.createSchedule({
    userId: req.auth!.id,
    ...req.body,
  });

  if (result.numInsertedOrUpdatedRows === BigInt(0)) {
    throw new Error();
  }

  res.status(201).json({ message: "일정이 생성되었습니다." });
};

export const updateSchedule = async (req: Request, res: Response) => {
  const result = await services.updateSchedule(req.params.scheduleId, req.body);

  if (result.numUpdatedRows === BigInt(0)) {
    throw new Error();
  }

  res.status(200).json({ message: "일정이 수정되었습니다." });
};

export const deleteSchedule = async (req: Request, res: Response) => {
  const result = await services.deleteSchedule(req.params.scheduleId);

  if (result.numDeletedRows === BigInt(0)) {
    throw new Error();
  }

  res.status(200).json({ message: "일정이 삭제되었습니다." });
};
