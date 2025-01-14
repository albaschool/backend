import { Request, Response } from "express";
import { nanoid } from "nanoid";

import * as services from "@/services/notifications.service";
import { notificationsSessionManager as sessionManager } from "@/utils/session-manager";

export const initializeSse = async (req: Request, res: Response) => {
  const session = await sessionManager.createSession(req.auth!.id, req, res, {
    userId: req.auth!.id,
    storeId: "", // TODO: storeId를 어떻게 저장할지 결정
  });

  const notifications = await services.getNotificationsByUserId(req.auth!.id, 10);

  session.push(notifications, "initialize", nanoid(12));
};

export const readNotifications = async (req: Request, res: Response) => {
  // TODO: 읽음 처리를 한번에 처리할지, 알림 ID를 받아와서 하나씩 읽음 처리할지 결정
  res.status(200).json({ success: true });
}