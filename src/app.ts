import cors from "cors";
import express from "express";
import { promises as fs } from "fs";
import { sql } from "kysely";
import path from "path";
import swaggerUi from "swagger-ui-express";

import config from "@/config";
import { db } from "@/db";
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
  (async () => {
    try {
      await (
        await import("@/config/swagger")
      ).default;

      const filePath = path.resolve(__dirname, "./swagger-output.json");
      try {
        await fs.access(filePath);
        const swaggerDocument = await import(filePath);
        app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      } catch {
        logger.warn("swagger-output.json does not exists.");
      }
    } catch (error) {
      logger.error("Swagger UI failed to initialize:", error);
    }
  })();
}

app.use("/", defaultRoutes);

app.listen(parseInt(config.http.port), config.http.host, () => {
  logger.info(`Node environment: ${config.node.env}`);
  logger.info(`Server is running on http://${config.http.host}:${config.http.port}`);
  if (config.node.env === "development") {
    logger.info(`Swagger UI is running on http://${config.http.host}:${config.http.port}/swagger`);
  }
});

sql`SELECT 1`
  .execute(db)
  .then(() => {
    logger.info("Database connection established.");
  })
  .catch((error) => {
    logger.error(error, "Database connection failed:");
    process.exit(1);
  });
