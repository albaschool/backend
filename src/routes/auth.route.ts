import express from "express";

import { email, emailVerify } from "@/controllers/auth";
const router = express.Router()

router.post(
  "/email",
  email
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
router.post(
    "/email/verify",
    emailVerify
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
)

export default router;