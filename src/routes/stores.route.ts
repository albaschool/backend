import express from "express";

import { getStores } from "@/controllers/stores.controller";

const router = express.Router();

router.get(
  "/",
  // #swagger.tags = ['Stores']
  getStores,
);

export default router;
