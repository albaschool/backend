import express from "express";

import { getNotifications, readNotifications } from "@/controllers/notifications.controller";
import authMiddleware from "@/middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "",
  /*
    #swagger.tags = ["Notifications"]
    #swagger.description = "최근 10개의 알림 목록을 조회합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          examples: {
            example: { $ref: "#/components/examples/notificationsExample" }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: "알림이 존재하지 않을 때",
      content: {
        "application/json": {
          example: []
        }
      }
    }
  */
  getNotifications,
);

router.put(
  "/read",
  /*
    #swagger.tags = ["Notifications"]
    #swagger.description = "알림을 읽음 처리합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: { success: true }
        }
      }
    }
  */
  readNotifications,
);

export default router;
