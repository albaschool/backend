import { NextFunction } from "express";
import { type Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "@/config";
import { AuthPayload } from "@/interfaces/jwt.interface";

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token || !token.startsWith("Bearer ")) {
    res.status(401).json({ message: "토큰을 찾을 수 없습니다." });
    return;
  }

  try {
    const decoded = jwt.verify(token.substring(7), config.jwt.secretKey) as AuthPayload;
    req.auth = decoded;
    console.log(req.auth);
    next();
  } catch {
    res.status(401).json({ message: "토큰이 유효하지 않습니다." });
  }
};

export default authMiddleware;
