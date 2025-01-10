import { Express } from "express";
import { promises as fs } from "fs";
import path from "path";
import swaggerAutogen from "swagger-autogen";
import swaggerUi from "swagger-ui-express";

import logger from "@/logger";

const doc = {
  info: {
    version: "1.0.0",
    title: "REST API",
    description: "",
  },
  host: "localhost:3000",
  tags: [
    {
      name: "Stores",
      description: "가게 엔드포인트",
    },
  ],
  components: {
    schemas: {
      testScheme: {
        $name: "John Doe",
        $age: 29,
        about: "",
      },
    },
  },
};

const outputFile = path.join(__dirname, "../swagger-output.json");
const endpointsFiles = [path.join(__dirname, "../../src/app.ts")];

const generateSwagger = swaggerAutogen({ openapi: "3.1.1" })(outputFile, endpointsFiles, doc);

export default generateSwagger;

export const setupSwagger = async (app: Express): Promise<boolean> => {
  try {
    await (
      await import("@/config/swagger")
    ).default;

    const filePath = path.join(__dirname, "../swagger-output.json");
    try {
      await fs.access(filePath);
      const swaggerDocument = await import(filePath);
      app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      return true;
    } catch {
      logger.error("swagger-output.json does not exists.");
      return false;
    }
  } catch (error) {
    logger.error(error, "Swagger UI failed to initialize:");
    return false;
  }
};
