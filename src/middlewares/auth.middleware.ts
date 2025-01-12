import { NextFunction } from "express";
import { type Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "@/config";
import HttpException from "@/interfaces/http-exception.interface";
import { AuthPayload } from "@/interfaces/jwt.interface";

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    throw new HttpException(401, "토큰을 찾을 수 없습니다.");
  }

  try {
    const decoded = jwt.verify(token.substring(7), config.jwt.secretKey) as AuthPayload;
    req.auth = decoded;
    next();
  } catch {
    throw new HttpException(401, "토큰이 유효하지 않습니다.");
  }
};

export default authMiddleware;
