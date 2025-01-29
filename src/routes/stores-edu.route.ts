import express from "express";

import { deleteEducation, getEducations } from "@/controllers/stores-edu.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import { storeIdParamsSchema } from "@/schemas/common.schema";

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
              "content": "",
              "img": null,
              "createdAt": "2025-01-29T18:20:00.000Z"
            },
            {
              "id": "corNml9ckz7d",
              "title": "POS 시스템 사용법",
              "content": "",
              "img": "https://example.com/corNml9ckz7d.png",
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
      description: "교육과정이 존재하지 않을 때",
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

router.delete(
  "/:eduId",
  /*
    #swagger.tags = ["Education"]
    #swagger.description = "특정 교육 자료를 삭제합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId', '#/components/parameters/eduId']
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: { message: "교육과정이 삭제되었습니다." }
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
      description: "교육과정이 존재하지 않을 때",
      content: {
        "application/json": {
          example: { message: "교육과정이 존재하지 않습니다." }
        }
      }
    }
  */
  validate(storeIdParamsSchema.merge(eduIdParamsSchema)),
  deleteEducation,
);

export default router;
