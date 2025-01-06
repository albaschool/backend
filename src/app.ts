import cors from "cors";
import express from "express";

import config from "@/config";
import { setupSwagger } from "@/config/swagger";
import { checkDbEstablished } from "@/db";
import logger, { httpLogger } from "@/logger";
import defaultRoutes from "@/routes/default.route";

const app = express();

app.use(express.json());
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

app.use("/", defaultRoutes);

app.listen(parseInt(config.http.port), config.http.host, () => {
  logger.info(`Node environment: ${config.node.env}`);
  logger.info(`Server is running on http://${config.http.host}:${config.http.port}`);
  if (config.node.env === "development") {
    logger.info(`Swagger UI is running on http://${config.http.host}:${config.http.port}/swagger`);
  }
});
