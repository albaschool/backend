import { Request, Response } from "express";
import { nanoid } from "nanoid";

import { getInitialNotification } from "@/services/chat.service";
import * as services from "@/services/notifications.service";
import { notificationsSessionManager as sessionManager } from "@/utils/session-manager";

export const initializeSse = async (req: Request, res: Response) => {
  const session = await sessionManager.createSession(req.auth!.id, req, res);
  const notifications = await services.getNotificationsByUserId(req.auth!.id, 10);
  const isNewMessage = await getInitialNotification(req.auth!.id);
  session.push(notifications, "initialize", nanoid(12));
  session.push(isNewMessage, "chatRoomInitialize", nanoid(12));
};

export const readNotifications = async (req: Request, res: Response) => {
  await services.readAllNotifications(req.auth!.id);
  res.status(200).json({ success: true });
};
