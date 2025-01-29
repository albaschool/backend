import express from "express";

import authMiddleware from "@/middlewares/auth.middleware";

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

export default router;
