import express from "express";

import { getMyStores, getStores } from "@/controllers/stores.controller";
import authMiddleware from "@/middlewares/auth.middleware";

const router = express.Router();

router.get(
  "/",
  // #swagger.tags = ["Stores"]
  // #swagger.description = "모든 가게를 조회합니다."
  // #swagger.security = [{ bearerAuth: [] }]
  /*
    #swagger.responses[404] = {
      description: "Not Found",
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
      description: "Not Found",
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

export default router;
