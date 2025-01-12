"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.post("/email", auth_1.email
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
router.post("/email/verify", auth_1.emailVerify
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
exports.default = router;
