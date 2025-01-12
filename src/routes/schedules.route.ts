import express from "express";

import { getSchedulesByUser } from "@/controllers/schedules.controller";
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

export default router;
