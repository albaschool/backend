import express from "express";

import {
  createSchedule,
  deleteSchedule,
  getSchedulesByStore,
  getSchedulesByUser,
  updateSchedule,
} from "@/controllers/schedules.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import { scheduleIdParamsSchema, storeIdParamsSchema } from "@/schemas/common.schema";
import { createScheduleBodySchema } from "@/schemas/schedules.schema";

const router = express.Router();

router.use(authMiddleware);

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

router.get(
  "/:storeId",
  /*
    #swagger.tags = ["Schedules"]
    #swagger.description = "특정 가게의 일정을 조회합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId']
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
  validate(storeIdParamsSchema),
  getSchedulesByStore,
);

router.post(
  "/:storeId",
  /*
    #swagger.tags = ["Schedules"]
    #swagger.description = "일정을 추가합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId']
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
    #swagger.responses[201] = {
      description: "Created",
      content: {
        "application/json": {
          example: { message: "일정이 생성되었습니다." }
        }
      }
    }
    #swagger.responses[403] = {
      description: "가게 주인이 아닐 때",
      content: {
        "application/json": {
          example: { message: "가게 주인만 생성할 수 있습니다." }
        }
      }
    }
  */
  validate(storeIdParamsSchema.merge(createScheduleBodySchema)),
  createSchedule,
);

router.put(
  "/:scheduleId",
  /*
    #swagger.tags = ["Schedules"]
    #swagger.description = "일정을 수정합니다.<br>수정이 필요한 필드만 넣어주세요."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/scheduleId']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/updateSchedule"
          }  
        }
      }
    }
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: { message: "일정이 수정되었습니다." }
        }
      }
    }
    #swagger.responses[403] = {
      description: "가게 주인이 아닐 때",
      content: {
        "application/json": {
          example: { message: "가게 주인만 수정할 수 있습니다." }
        }
      }
    }
    #swagger.responses[404] = {
      description: "일정이 존재하지 않을 때",
      content: {
        "application/json": {
          example: { message: "일정이 존재하지 않습니다." }
        }
      }
    }
  */
  validate(scheduleIdParamsSchema),
  updateSchedule,
);

router.delete(
  "/:scheduleId",
  /*
    #swagger.tags = ["Schedules"]
    #swagger.description = "일정을 삭제합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/scheduleId']
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: { message: "일정이 삭제되었습니다." }
        }
      }
    }
    #swagger.responses[403] = {
      description: "가게 주인이 아닐 때",
      content: {
        "application/json": {
          example: { message: "가게 주인만 삭제할 수 있습니다." }
        }
      }
    }
    #swagger.responses[404] = {
      description: "일정이 존재하지 않을 때",
      content: {
        "application/json": {
          example: { message: "일정이 존재하지 않습니다." }
        }
      }
    }
  */
  validate(scheduleIdParamsSchema),
  deleteSchedule,
);

export default router;
