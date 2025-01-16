import { Request, Response } from "express";

import HttpException from "@/interfaces/http-exception.interface";
import { CreateSchedulePayload } from "@/interfaces/schedules.interface";
import { createNotification, getNameOfDay, getStoreNameById } from "@/services/notifications.service";
import * as services from "@/services/schedules.service";

/** GET /schedules */
export const getSchedulesByUser = async (req: Request, res: Response) => {
  const schedules = await services.getSchedulesByUser(req.auth!.id);

  if (schedules.length === 0) {
    res.status(404).json([]);
    return;
  }

  res.status(200).json(schedules);
};

/** GET /schedules/:storeId */
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

/** POST /schedules */
export const createSchedule = async (req: Request, res: Response) => {
  if (req.auth?.role !== "manager") {
    throw new HttpException(403, "가게 주인만 생성할 수 있습니다.");
  }
  
  const payload: CreateSchedulePayload = req.body;
  if (!(await services.isStoreOwner(req.auth!.id, payload.storeId))) {
    throw new HttpException(403, "가게 주인만 생성할 수 있습니다.");
  }

  const result = await services.createSchedule(payload);

  if (result.numInsertedOrUpdatedRows === BigInt(0)) {
    throw new Error();
  }

  // TODO: 프론트엔드 라우팅 경로 수정
  await createNotification({
    content: `${getNameOfDay(payload.dayOfWeek)}요일 일정이 추가되었습니다.`,
    target: "/schedules",
    title: await getStoreNameById(payload.storeId) ?? '알 수 없는 가게',
    userId: payload.userId
  })

  res.status(201).json({ message: "일정이 생성되었습니다." });
};

/** PUT /schedules/:scheduleId */
export const updateSchedule = async (req: Request, res: Response) => {
  if (req.auth?.role !== "manager") {
    throw new HttpException(403, "가게 주인만 수정할 수 있습니다.");
  }

  const schedule = await services.getScheduleById(req.params.scheduleId);

  if (!schedule) throw new HttpException(404, "일정이 존재하지 않습니다.");

  if (!(await services.isStoreOwner(req.auth!.id, schedule.storeId))) {
    throw new HttpException(403, "가게 주인만 수정할 수 있습니다.");
  }

  const result = await services.updateSchedule(req.params.scheduleId, req.body);

  if (result.numUpdatedRows === BigInt(0)) {
    throw new Error();
  }

  res.status(200).json({ message: "일정이 수정되었습니다." });
};

/** DELETE /schedules/:scheduleId */
export const deleteSchedule = async (req: Request, res: Response) => {
  if (req.auth?.role !== "manager") {
    throw new HttpException(403, "가게 주인만 삭제할 수 있습니다.");
  }

  const schedule = await services.getScheduleById(req.params.scheduleId);
  if (!schedule) throw new HttpException(404, "일정이 존재하지 않습니다.");

  if (!(await services.isStoreOwner(req.auth!.id, schedule.storeId))) {
    throw new HttpException(403, "가게 주인만 삭제할 수 있습니다.");
  }

  const result = await services.deleteSchedule(req.params.scheduleId);

  if (result.numDeletedRows === BigInt(0)) {
    throw new Error();
  }

  res.status(200).json({ message: "일정이 삭제되었습니다." });
};
