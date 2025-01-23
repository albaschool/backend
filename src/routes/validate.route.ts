import express from "express";

import { validateBizRegistrationNum } from "@/controllers/validate.controller";
import authMiddleware from "@/middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/biz-registration-number",
  /*
    #swagger.tags = ["Validate"]
    #swagger.description = "사업자 등록번호를 검증합니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              bizRegistrationNum: {
                type: "string",
                example: "1234567890"
              }
            },
            required: ["bizRegistrationNum"]
          }  
        }
      }
    }
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          example: { value: "암호화된 값" }
        }
      }
    }
    #swagger.responses[400] = {
      description: "사업자 등록번호 검증 실패",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string"
              }
            }
          },
          examples: {
            "규격 불일치": {
              value: { message: "사업자 등록번호가 올바르지 않습니다." }
            },
            "국세청 조회 불가": {
              value: { message: "국세청에 등록되지 않은 사업자 등록번호입니다." }
            }
          }
        }
      }
    }
    #swagger.responses[500] = {
      description: "사업자 등록번호 검증 중 오류가 발생했을 때",
      content: {
        "application/json": {
          example: { message: "사업자 등록번호 검증 중 오류가 발생했습니다." }
        }
      }
    }
  */
  validateBizRegistrationNum,
);

export default router;
