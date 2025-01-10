import express from "express";

import { addStore, deleteStoreMember, getMyStores, getStoreById, getStoreMembers, getStores } from "@/controllers/stores.controller";
import authMiddleware from "@/middlewares/auth.middleware";

const router = express.Router();

router.get(
  "/",
  // #swagger.tags = ["Stores"]
  // #swagger.description = "모든 가게를 조회합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.responses[404] = {
      description: "가게가 존재하지 않을 때",
      content: {
        "application/json": {
          example: []
        }
      }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      content: {
        "application/json": {
          example: { message: "Internal server error" }
        }
      }
    }
  */
  authMiddleware,
  getStores,
);

router.get(
  "/me",
  // #swagger.tags = ["Stores"]
  // #swagger.description = "내 가게를 조회합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.responses[404] = {
      description: "사용자 소유의 가게가 존재하지 않을 때",
      content: {
        "application/json": {
          example: []
        }
      }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      content: {
        "application/json": {
          example: { message: "Internal server error" }
        }
      }
    }
  */
  authMiddleware,
  getMyStores,
);

router.get(
  "/:id",
  // #swagger.tags = ["Stores"]
  // #swagger.description = "특정 가게를 조회합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.parameters['id'] = {
      description: '가게 아이디',
      required: true,
    }
  */
  /*
    #swagger.responses[404] = {
      description: "가게가 존재하지 않을 때",
      content: {
        "application/json": {
          example: { message: "존재하지 않는 가게입니다." }
        }
      }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      content: {
        "application/json": {
          example: { message: "Internal server error" }
        }
      }
    }
  */
  authMiddleware,
  getStoreById,
);

router.get(
  "/:id/members",
  // #swagger.tags = ["Stores"]
  // #swagger.description = "특정 가게의 직원 목록을 조회합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.parameters['id'] = {
      description: '가게 아이디',
      required: true,
    }
  */
  /*
    #swagger.responses[403] = {
      description: "가게 소유자가 아닐 때",
      content: {
        "application/json": {
          example: { message: "가게 소유자만 조회할 수 있습니다." }
        }
      }
    }
    #swagger.responses[404] = {
      description: "가게에 소속된 직원이 없을 때",
      content: {
        "application/json": {
          example: []
        }
      }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      content: {
        "application/json": {
          example: { message: "Internal server error" }
        }
      }
    }
  */
  authMiddleware,
  getStoreMembers,
);

router.post(
  "/",
  // #swagger.tags = ["Stores"]
  // #swagger.description = "가게를 생성합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/addUser"
          }  
        }
      }
    }
  */
  /*
    #swagger.responses[201] = {
      description: "Created",
      content: {
        "application/json": {
          example: { ok: true }
        }
      }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      content: {
        "application/json": {
          example: { message: "Internal server error" }
        }
      }
    }
  */
  authMiddleware,
  addStore,
);

router.delete(
  "/:storeId/members/:memberId",
  // #swagger.tags = ["Stores"]
  // #swagger.description = "특정 가게의 직원을 삭제합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.parameters['storeId'] = {
      description: '가게 아이디',
      required: true,
    }
      #swagger.parameters['memberId'] = {
      description: '직원 아이디',
      required: true,
    }
  */
  /*
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: { ok: true }
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
      description: "존재하지 않는 직원일 때",
      content: {
        "application/json": {
          example: { message: "존재하지 않는 직원입니다." }
        }
      }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      content: {
        "application/json": {
          example: { message: "Internal server error" }
        }
      }
    }
  */
  authMiddleware,
  deleteStoreMember,
);

export default router;
