import express from "express";

import { index } from "@/controllers/default.controller";

const router = express.Router();

router.get(
  "/",
  index,
  /*
  #swagger.responses[200] = {
    description: '성공',
    content: {
      "application/json": {
        example: {
          message: "Hello World!",
        }
      }
    }
  }
  */
);

export default router;
