import express from "express";

import { createSchedule, getSchedulesByStore, getSchedulesByUser } from "@/controllers/schedules.controller";
import authMiddleware from "@/middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

/** GET /schedules */
router.get(
  "",
  /*
    #swagger.tags = ["Schedules"]
    #swagger.description = "내 일정을 조회합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          examples: {
            example: { $ref: "#/components/examples/schedulesByUserExample" }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: "일정이 존재하지 않을 때",
      content: {
        "application/json": {
          example: []
        }
      }
    }
  */
  getSchedulesByUser,
);

/** /schedules/:storeId */
router.get(
  "/:storeId",
  /*
    #swagger.tags = ["Schedules"]
    #swagger.description = "특정 가게의 일정을 조회합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[403] = {
      description: "가게에 소속되어 있지 않을 때",
      content: {
        "application/json": {
          example: { message: "가게에 소속되어 있지 않습니다." }
        }
      }
    }
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          examples: {
            example: { $ref: "#/components/examples/schedulesByStoreExample" }
          }
        }
      }
  }
    #swagger.responses[404] = {
      description: "일정이 존재하지 않을 때",
      content: {
        "application/json": {
          example: []
        }
      }
    }
  */
  getSchedulesByStore,
);

/** POST /schedules */
router.post(
  "",
  /*
    #swagger.tags = ["Schedules"]
    #swagger.description = "일정을 추가합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/createSchedule"
          }  
        }
      }
    }
  */
  createSchedule,
);

export default router;
