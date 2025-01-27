import { Request, Response } from "express";

import * as services from "@/services/notifications.service";

export const getNotifications = async (req: Request, res: Response) => {
  const notifications = await services.getNotificationsByUserId(req.auth!.id, 10);
  res.status(notifications.length > 0 ? 200 : 404).json(notifications);
};

export const readNotifications = async (req: Request, res: Response) => {
  await services.readAllNotifications(req.auth!.id);
  res.status(200).json({ success: true });
};
