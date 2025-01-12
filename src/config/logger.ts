import { Request } from "express";
import pino from "pino";
import pinoHttp from "pino-http";

const httpLogger = pinoHttp({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  customLogLevel: (_, res, err) => {
    if ((res.statusCode ?? 0) >= 400 && (res.statusCode ?? 0) < 500) {
      return "warn";
    } else if ((res.statusCode ?? 0) >= 500 || err) {
      return "error";
    }
    return "info";
  },
  customSuccessMessage: (req: Request, res, responseTime) => {
    return `HTTP ${res.statusCode} ${req.method} ${req.originalUrl} - ${responseTime}ms`;
  },
  customErrorMessage: (req: Request, res, error) => {
    return `HTTP ${res.statusCode} ${req.method} ${req.originalUrl} ${error.message}`;
  },
  serializers: {
    req: () => undefined,
    res: () => undefined,
    responseTime: () => undefined,
  },
});

const logger = pino({
  level: process.env.NODE_ENV === "test" ? "silent" : process.env.NODE_ENV !== "production" ? "debug" : "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export default logger;
export { httpLogger };
