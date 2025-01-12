import express from "express";

import { email, emailVerify, fixPassword, login, regist } from "@/controllers/auth.controller";
import authMiddleware from "@/middlewares/auth.middleware";
const router = express.Router()

router.post(
    "/email",
  // #swagger.tags = ["Auth"]
  // #swagger.description = "이메일 인증번호를 전송합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/emailSend"
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
          example: { message: "이메일을 성공적으로 보냈습니다." }
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
    email,
    
);
router.post(
    "/email/verify",
    // #swagger.tags = ["Auth"]
  // #swagger.description = "이메일 인증번호를 전송합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/emailVerify"
          }  
        }
      }
    }
  */
  /*
    #swagger.responses[200] = {
      description: "Success",
      content: {
        "application/json": {
          example: { message: "이메일 인증에 성공했습니다." }
        }
      }
    }
    #swagger.responses[404] = {
      description: "Success",
      content: {
        "application/json": {
          example: { message: "인증번호를 확인해 주세요" }
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
  
  emailVerify
)
router.post(
    "/register",
    // #swagger.tags = ["Auth"]
  // #swagger.description = "이메일 인증번호를 전송합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
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
  */
  /*
    #swagger.responses[201] = {
      description: "Created",
      content: {
        "application/json": {
          example: { message: "가게가 생성되었습니다." }
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
 regist
)

router.post(
    "/login",
    // #swagger.tags = ["Auth"]
  // #swagger.description = "이메일 인증번호를 전송합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
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
  */
  /*
    #swagger.responses[201] = {
      description: "Created",
      content: {
        "application/json": {
          example: { message: "가게가 생성되었습니다." }
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
    login
)

router.put(
    "/fixPassword",
    // #swagger.tags = ["Auth"]
  // #swagger.description = "이메일 인증번호를 전송합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
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
  */
  /*
    #swagger.responses[201] = {
      description: "Created",
      content: {
        "application/json": {
          example: { message: "가게가 생성되었습니다." }
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
    fixPassword,
)
export default router;