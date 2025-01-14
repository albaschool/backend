import { Request, Response } from "express";

import * as services from "@/services/notifications.service";

export const getMyNotifications = async (req: Request, res: Response) => {
  const notifications = await services.getNotificationByUserId(req.auth!.id);

  if (notifications.length === 0) {
    res.status(404).json([]);
    return;
  }

  res.json(notifications);
};
