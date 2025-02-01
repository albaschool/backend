import "express-async-errors";

import cors from "cors";
import express from "express";
import http from "http";

import config from "@/config";
import { checkR2Bucket } from "@/config/r2";
import { setupSwagger } from "@/config/swagger";
import { checkDbEstablished } from "@/db";
import logger, { httpLogger } from "@/logger";
import errorMiddleware from "@/middlewares/error.middleware";
import { startMonitoring } from "@/monitors";
import chatRoute from "@/routes/chat.route";
import notificationsRoute from "@/routes/notifications.route";
import schedulesRoute from "@/routes/schedules.route";
import sseRouter from "@/routes/sse.route";
import storesRoute from "@/routes/stores.route";
import validateRouter from "@/routes/validate.route";

import socketRun from "./controllers/socket.controller";
import authRoute from "./routes/auth.route";

const app = express();
const server = http.createServer(app);
socketRun(server);

app.use(
  express.json({
    limit: "50mb",
  }),
);
app.use(httpLogger);

app.use(
  cors({
    origin: [`http://localhost:${config.http.port}`, `http://127.0.0.1:${config.http.port}`, ...config.http.cors],
    credentials: true,
  }),
);

if (config.node.env === "development") {
  (async () => await setupSwagger(app))();
}

checkDbEstablished();
startMonitoring();
checkR2Bucket();

app.use("/chat", chatRoute);
app.use("/auth", authRoute);
app.use("/stores", storesRoute);
app.use("/schedules", schedulesRoute);
app.use("/notifications", notificationsRoute);
app.use("/validate", validateRouter);
app.use("/sse", sseRouter);

app.use(errorMiddleware);

app.set("port", config.http.port);
server.listen(parseInt(config.http.port), config.http.host, () => {
  logger.info(`Node environment: ${config.node.env}`);
  logger.info(`Server is running on http://${config.http.host}:${config.http.port}`);
  if (config.node.env === "development") {
    logger.info(`Swagger UI is running on http://${config.http.host}:${config.http.port}/swagger`);
  }
});
