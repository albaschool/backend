import express from "express";

import { getMyNotifications } from "@/controllers/notifications.controller";
import authMiddleware from "@/middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "",
  /*
    #swagger.tags = ["Notifications"]
    #swagger.description = "내 알림을 조회합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          examples: {
            example: { $ref: "#/components/examples/notificationsByUserExample" }
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
  getMyNotifications,
);

export default router;
