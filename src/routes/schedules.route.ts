import express from "express";

import { getSchedulesByStore, getSchedulesByUser } from "@/controllers/schedules.controller";
import authMiddleware from "@/middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

/** GET /schedules */
router.get(
  "",
  // #swagger.tags = ["Schedules"]
  // #swagger.description = "내 일정을 조회합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  getSchedulesByUser,
);

/** /schedules/:storeId */
router.get(
  "/:storeId",
  // #swagger.tags = ["Schedules"]
  // #swagger.description = "특정 가게의 일정을 조회합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.responses[403] = {
      description: "가게에 소속되어 있지 않을 때",
      content: {
        "application/json": {
          example: { message: "가게에 소속되어 있지 않습니다." }
        }
      }
    }
  */
  getSchedulesByStore,
);

export default router;
