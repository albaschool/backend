import express from "express";

import {
  addStoreMember,
  createStore,
  deleteStore,
  deleteStoreMember,
  getMyStores,
  getStoreById,
  getStoreMembers,
  getStores,
  updateStoreById,
} from "@/controllers/stores.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import coursesRoute from "@/routes/stores-edu.route";
import { storeIdParamsSchema, userIdParamsSchema } from "@/schemas/common.schema";
import { createStoreSchema, passwordSchema } from "@/schemas/stores.schema";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "",
  /*
    #swagger.tags = ["Stores"]
    #swagger.description = "모든 가게를 조회합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          examples: {
            example: { $ref: "#/components/examples/storesExample" }
          }
        }
      }
    }
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
  getStores,
);

router.post(
  "",
  /*
    #swagger.tags = ["Stores"]
    #swagger.description = "가게를 생성합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/createStore"
          }  
        }
      }
    }
    #swagger.responses[201] = {
      description: "Created",
      content: {
        "application/json": {
          example: { message: "가게가 생성되었습니다." }
        }
      }
    }
    #swagger.responses[400] = {
      description: "사업자 등록번호가 올바르지 않을 때",
      content: {
        "application/json": {
          example: { message: "사업자 등록번호가 올바르지 않습니다." }
        }
      }
    }
    #swagger.responses[403] = {
      description: "사장님 계정이 아닐 때",
      content: {
        "application/json": {
          example: { message: "사장님만 생성할 수 있습니다." }
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
  validate(createStoreSchema),
  createStore,
);

router.get(
  "/me",
  // #swagger.tags = ["Stores"]
  // #swagger.description = "내 가게를 조회합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          examples: {
            example: { $ref: "#/components/examples/storesExample" }
          }
        }
      }
    }
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
  getMyStores,
);

router.get(
  "/:storeId",
  /*
    #swagger.tags = ["Stores"]
    #swagger.description = "특정 가게를 조회합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId']
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          examples: {
            example: { $ref: "#/components/examples/storeExample" }
          }
        }
      }
    }
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
  validate(storeIdParamsSchema),
  getStoreById,
);

router.get(
  "/:storeId/members",
  /*
    #swagger.tags = ["Stores"]
    #swagger.description = "특정 가게의 직원 목록을 조회합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId']
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
  validate(storeIdParamsSchema),
  getStoreMembers,
);

router.put(
  "/:storeId",
  /*
    #swagger.tags = ["Stores"]
    #swagger.description = "특정 가게를 수정합니다.<br>수정이 필요한 필드만 넣어주세요."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/updateStore"
          }  
        }
      }
    }
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: { message: "가게 정보가 수정되었습니다." }
        }
      }
    }
    #swagger.responses[403] = {
      description: "가게 소유자가 아닐 때",
      content: {
        "application/json": {
          example: { message: "가게 소유자만 수정할 수 있습니다." }
        }
      }
    }
    #swagger.responses[404] = {
      description: "존재하지 않는 가게일 때",
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
  updateStoreById,
);

router.post(
  "/:storeId/members",
  /*
    #swagger.tags = ["Stores"]
    #swagger.description = "특정 가게에 직원을 추가합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/addMember"
          }  
        }
      }
    }
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId']
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: { message: "GS25 서울역점 가게에 추가되었습니다." }
        }
      }
    }
    #swagger.responses[401] = {
      description: "비밀번호가 일치하지 않을 때",
      content: {
        "application/json": {
          example: { message: "비밀번호가 일치하지 않습니다." }
        }
      }
    }
    #swagger.responses[403] = {
      description: "직원 계정이 아닐 때",
      content: {
        "application/json": {
          example: { message: "직원만 사용할 수 있습니다." }
        }
      }
    }
    #swagger.responses[404] = {
      description: "가게가 존재하지 않을 때",
      content: {
        "application/json": {
          example: { message: "존재하지 않는 가게입니다." }
        }
      }
    }
    #swagger.responses[409] = {
      description: "이미 존재하는 직원일 때",
      content: {
        "application/json": {
          example: { message: "이미 가게에 소속되어 있습니다." }
        }
      }
    }
  */
  validate(storeIdParamsSchema.merge(passwordSchema)),
  addStoreMember,
);

router.delete(
  "/:storeId/members/:userId",
  /*
    #swagger.tags = ["Stores"]
    #swagger.description = "특정 가게의 직원을 삭제합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId', '#/components/parameters/userId']
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: { message: "직원이 삭제되었습니다." }
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
  validate(storeIdParamsSchema.merge(userIdParamsSchema)),
  deleteStoreMember,
);

router.delete(
  "/:storeId",
  /*
    #swagger.tags = ["Stores"]
    #swagger.description = "특정 가게를 삭제합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['$ref'] = ['#/components/parameters/storeId']
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: { message: "가게가 삭제되었습니다." }
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
  */
  deleteStore,
)

router.use("/:storeId/edu", coursesRoute);

export default router;
