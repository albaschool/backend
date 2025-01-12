import { NextFunction, Request, Response } from "express";

import HttpException from "@/interfaces/http-exception.interface";
import logger from "@/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof HttpException ? err.status : 500;
  const message = err instanceof HttpException ? err.message || "Internal server error" : "Internal server error";
  if (!(err instanceof HttpException)) logger.error(err);
  res.status(status).json({ message });
};

export default errorMiddleware;
