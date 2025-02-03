import express from "express";

import { getChatRoomDetail } from "@/controllers/chat.controller";
import authMiddleware from "@/middlewares/auth.middleware";
const router = express.Router();

//채팅방 상세 조회
router.get(
  "/:id",
  /*
    #swagger.tags = ["Chat"]
    #swagger.description = "채팅방의 상세 내역을 가져옵니다."
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = {
      description: "OK",
      content: {
        "application/json": {
          examples: {
            example: { $ref: "#/components/examples/chatRoomDetailExample" }
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
  authMiddleware,
  getChatRoomDetail,
);

export default router;
