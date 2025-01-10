import express from "express";

import { getMyStores, getStores } from "@/controllers/stores.controller";
import authMiddleware from "@/middlewares/auth.middleware";

const router = express.Router();

router.get(
  "/",
  // #swagger.tags = ['Stores']
  // #swagger.description = '모든 가게를 조회합니다.'
  getStores,
);

router.get(
  "/me",
  // #swagger.tags = ['Stores']
  // #swagger.description = '내 가게를 조회합니다.'
  // #swagger.security = [{ bearerAuth: [] }]
  authMiddleware,
  getMyStores,
);

export default router;
