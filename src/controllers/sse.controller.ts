import { Request, Response } from "express";
import { nanoid } from "nanoid";

import { getInitialNotification } from "@/services/chat.service";
import * as services from "@/services/notifications.service";
import { notificationsSessionManager as sessionManager } from "@/utils/session-manager";

export const initializeSse = async (req: Request, res: Response) => {
  const session = await sessionManager.createSession(req.auth!.id, req, res);
  const hasUnreadNotification = await services.hasUnreadNotification(req.auth!.id);
  const isNewMessage = await getInitialNotification(req.auth!.id);
  session.push({ hasUnreadNotification }, "initialize", nanoid(12));
  session.push(isNewMessage, "chatRoomInitialize", nanoid(12));
};
