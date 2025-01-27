import express from "express";

import { initializeSse } from "@/controllers/sse.controller";
import authMiddleware from "@/middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "",
  /*
    #swagger.tags = ["SSE"]
    #swagger.description = "Server-Sent Events를 통해 실시간 알림을 받습니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "text/event-stream": {
          examples: {
            initialize: { $ref: "#/components/examples/notificationInitialize" },
            notification: { $ref: "#/components/examples/notification" },
            chatNotificationInitialize : {$ref: "#/components/examples/chatNotificationInitialize"},
            chatNotification : { $ref: "#/components/examples/chatNotification" },
          }
        }
      }
    }
  */
  initializeSse,
);

export default router;
