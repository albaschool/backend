import { Request, Response } from "express";

import * as services from "@/services/schedules.service";

export const getSchedulesByUser = async (req: Request, res: Response) => {
  const schedules = await services.getSchedulesByUser(req.auth!.id);

  if (schedules.length === 0) {
    res.status(204).json([]);
    return;
  }

  res.status(200).json(schedules);
}