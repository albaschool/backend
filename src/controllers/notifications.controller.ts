import { Request, Response } from "express";
import { nanoid } from "nanoid";

import * as services from "@/services/notifications.service";
import { notificationsSessionManager as sessionManager } from "@/utils/session-manager";

export const initializeSse = async (req: Request, res: Response) => {
  const session = await sessionManager.createSession(req.auth!.id, req, res);
  const notifications = await services.getNotificationsByUserId(req.auth!.id, 10);
  session.push(notifications, "initialize", nanoid(12));
};

export const readNotifications = async (req: Request, res: Response) => {
  await services.readAllNotifications(req.auth!.id);
  res.status(200).json({ success: true });
};
