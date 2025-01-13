import express from "express";

import { checkUserPassword, email, emailVerify, fixPassword, login, regist } from "@/controllers/auth.controller";
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
  // #swagger.description = "회원가입."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/saveUser"
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
          example: { message: "회원가입이 완료 됐습니다." }
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
  // #swagger.description = "로그인을 진행합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/login"
          }  
        }
      }
    }
  */
  /*
    #swagger.responses[200] = {
      description: "Created",
      content: {
        "application/json": {
          example: { message: "로그인이 완료 됐습니다." }
        }
      }
    }

    #swagger.responses[404] = {
    description: "Not Found",
    content: {
      "application/json": {
        example: { message: "아이디 혹은 비밀번호가 일치하지 않습니다." }
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
  // #swagger.description = "비밀번호를 변경합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/password"
          }  
        }
      }
    }
  */
  /*
    #swagger.responses[200] = {
      description: "Created",
      content: {
        "application/json": {
          example: { message: "비밀번호 변경이 완료됐습니다." }
        }
      }
    }
    #swagger.responses[401] = {
    description: "토큰 만료",
    content: {
      "application/json": {
        example: { message: "토큰이 만료 됐습니다." }
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

router.put(
  "/fixPassword",
  // #swagger.tags = ["Auth"]
// #swagger.description = "사용자의 비밀번호를 확인합니다."
// #swagger.security = [{ bearerAuth: [] }]
/*
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/password"
        }  
      }
    }
  }
*/
/*
  #swagger.responses[200] = {
    description: "Ok",
    content: {
      "application/json": {
        example: { message: "비밀번호 확인이 완료됐습니다." }
      }
    }
  }
  #swagger.responses[401] = {
    description: "토큰 만료",
    content: {
      "application/json": {
        example: { message: "토큰이 만료 됐습니다." }
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
  checkUserPassword,
)
export default router;