import express from "express";

import { createEducation, deleteEducation, getEducation, getEducations, updateEducation } from "@/controllers/stores-edu.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import { storeIdParamsSchema } from "@/schemas/common.schema";
import { createEducationSchema, eduIdParamsSchema, updateEducationSchema } from "@/schemas/educations.schema";

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.get(
  "",
  /*
    #swagger.tags = ["Education"]
    #swagger.description = "특정 가게의 교육 자료 목록을 조회합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId']
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: [
            {
              "id": "984u-jMksANg",
              "title": "폐기 상품 처리 방법",
              "content": "폐기 상품은 ...",
              "createdAt": "2025-01-29T18:20:00.000Z"
            },
            {
              "id": "corNml9ckz7d",
              "title": "POS 시스템 사용법",
              "content": "POS 시스템은 ...",
              "createdAt": "2025-01-29T18:20:25.000Z"
            },
          ]
        }
      }
    }
    #swagger.responses[403] = {
      description: "가게가 존재하지 않거나 가게에 소속되어 있지 않을 때",
      content: {
        "application/json": {
          example: { message: "가게가 존재하지 않거나 가게에 소속되어 있지 않습니다." }
        }
      }
    }
    #swagger.responses[404] = {
      description: "강의 자료가 존재하지 않을 때",
      content: {
        "application/json": {
          example: []
        }
      }
    }
  */
  validate(storeIdParamsSchema),
  getEducations,
);

router.post(
  "",
  /*
    #swagger.tags = ["Education"]
    #swagger.description = "특정 가게에 교육 자료를 추가합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          example: {
            "title": "POS 시스템 사용법",
            "content": "POS 시스템은 ..."
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "Created",
      content: {
        "application/json": {
          schema: {
            example: { message: "강의 자료가 생성되었습니다." }
          }
        }
      }
    }
    #swagger.responses[403] = {
      description: "가게 소유자가 아닐 때",
      content: {
        "application/json": {
          example: { message: "가게 소유자만 생성할 수 있습니다." }
        }
      }
    }
  */
  validate(storeIdParamsSchema.merge(createEducationSchema)),
  createEducation,
);

router.get(
  "/:eduId",
  /*
    #swagger.tags = ["Education"]
    #swagger.description = "특정 가게의 교육 자료 목록을 조회합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId', '#/components/parameters/eduId']
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: {
            "id": "corNml9ckz7d",
            "title": "POS 시스템 사용법",
            "content": "POS 시스템은 ...",
            "createdAt": "2025-01-29T18:20:25.000Z"
          },
        }
      }
    }
    #swagger.responses[403] = {
      description: "가게가 존재하지 않거나 가게에 소속되어 있지 않을 때",
      content: {
        "application/json": {
          example: { message: "가게가 존재하지 않거나 가게에 소속되어 있지 않습니다." }
        }
      }
    }
    #swagger.responses[404] = {
      description: "강의 자료가 존재하지 않을 때",
      content: {
        "application/json": {
          example: {
            "message": "존재하지 않는 강의 자료입니다."
          }
        }
      }
    }
  */
  validate(storeIdParamsSchema),
  getEducation,
);

router.put(
  "/:eduId",
  /*
    #swagger.tags = ["Education"]
    #swagger.description = "특정 가게의 교육 자료를 수정합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId', '#/components/parameters/eduId']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          example: {
            "title": "POS 시스템 사용법",
            "content": "POS 시스템은 ..."
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            example: { message: "강의 자료가 수정되었습니다." }
          }
        }
      }
    }
    #swagger.responses[403] = {
      description: "가게 소유자가 아닐 때",
      content: {
        "application/json": {
          example: { message: "가게 소유자만 생성할 수 있습니다." }
        }
      }
    }
  */
  validate(storeIdParamsSchema.merge(updateEducationSchema)),
  updateEducation,
);

router.delete(
  "/:eduId",
  /*
    #swagger.tags = ["Education"]
    #swagger.description = "특정 가게의 교육 자료를 삭제합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId', '#/components/parameters/eduId']
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: { message: "강의 자료가 삭제되었습니다." }
        }
      }
    }
    #swagger.responses[403] = {
      description: "가게 소유자가 아닐 때",
      content: {
        "application/json": {
          example: { message: "가게 소유자만 삭제할 수 있습니다." }
        }
      }
    }
    #swagger.responses[404] = {
      description: "강의 자료가 존재하지 않을 때",
      content: {
        "application/json": {
          example: { message: "강의 자료가 존재하지 않습니다." }
        }
      }
    }
  */
  validate(storeIdParamsSchema.merge(eduIdParamsSchema)),
  deleteEducation,
);

export default router;
