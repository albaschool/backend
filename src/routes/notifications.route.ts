import express from "express";

import { initializeSse } from "@/controllers/notifications.controller";
import authMiddleware from "@/middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "",
  /*
    #swagger.tags = ["Notifications"]
    #swagger.description = "Server-Sent Events를 통해 실시간 알림을 받습니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "text/event-stream": {
          examples: {
            initialize: { $ref: "#/components/examples/notificationsInitialize" }
          }
        }
      }
    }
  */
  initializeSse,
);

router.put(
  "/read",
  /*
    #swagger.tags = ["Notifications"]
    #swagger.description = "알림을 읽음 처리합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[204] = {
      description: "No Content"
    }
  */
);

export default router;
