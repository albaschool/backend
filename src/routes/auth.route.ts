import express from "express";
import multer from "multer";

import { multerImageConfig } from "@/config/multer";
import {
  checkUserPassword,
  deleteProfile,
  email,
  emailVerify,
  fixPassword,
  getMyPage,
  login,
  regist,
  updateAuth,
  uploadProfile,
} from "@/controllers/auth.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import { emailSendSchema, passwordSchema, saveUserSchema } from "@/schemas/auth.schema";
const router = express.Router();

const upload = multer(multerImageConfig);

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
  validate(emailSendSchema),
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

  emailVerify,
);
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
  validate(saveUserSchema),
  regist,
);

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
  login,
);

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
);

router.post(
  "/checkPassword",
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
  validate(passwordSchema),
  authMiddleware,
  checkUserPassword,
);

router.get(
  "/me",
  // #swagger.tags = ["Auth"]
  // #swagger.description = "내 정보 조회."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          examples: {
            example: { $ref: "#/components/examples/getAuthInfoExample" }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: "사용자의 정보를 가지고 있지 않음",
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
  getMyPage,
);

router.post(
  "/profile",
  /* 
    #swagger.tags = ["Auth"]
    #swagger.description = "프로필 이미지를 업로드합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.consumes = ["multipart/form-data"]
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              profile: {
                type: "string",
                format: "binary"
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: {
            message: "프로필 사진이 수정되었습니다."
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      content: {
        "application/json": {
          example: {
            message: "이미지 파일을 업로드 해주세요."
          }
        }
      }
    }
  */
  authMiddleware,
  upload.single("profile"),
  uploadProfile,
);

router.delete(
  "/profile",
  /*
    #swagger.tags = ["Auth"]
    #swagger.description = "프로필 이미지를 삭제합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: { message: "프로필 사진이 삭제되었습니다." }
        }
      }
    }
  */
  authMiddleware,
  deleteProfile,
);

router.put(
  "/update",
  // #swagger.tags = ["Auth"]
  // #swagger.description = "회원정보를 변경합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/updateUser"
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
  updateAuth,
);

export default router;
