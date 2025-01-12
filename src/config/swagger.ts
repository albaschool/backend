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
    {
      name: "Schedules",
      description: " 일정 엔드포인트",
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  components: {
    schemas: {
      createStore: {
        $title: "GS25 서울역점",
        $location: "서울 용산구 한강대로 401",
        $contact: "0212345678",
        $password: "password",
      },
      addMember: {
        $memberId: "",
      },
      createSchedule: {
        $userId: "0pm8MlHvf366",
        $storeId: "4uDfVBHq",
        $content: "오후타임",
        $dayOfWeek: 1,
        $startTime: "12:00:00",
        $endTime: "18:00:00",
      },
      updateSchedule: {
        dayOfWeek: 1,
        startTime: "14:00:00",
      },
    },
    examples: {
      storesExample: {
        value: [
          {
            id: "4uDfVBHq",
            title: "GS25 서울역점",
            location: "서울 용산구 한강대로 401",
          },
        ],
      },
      storeExample: {
        value: {
          title: "GS25 서울역점",
          location: "서울 용산구 한강대로 401",
          contact: "0212345678",
        },
      },
      schedulesByUserExample: {
        value: [
          {
            id: "TCYP4hBtP2wpG2YX",
            title: "GS25 서울역점",
            content: "오후타임",
            dayOfWeek: 1,
            startTime: "12:00:00",
            endTime: "18:00:00",
          },
        ],
      },
      schedulesByStoreExample: {
        value: [
          {
            id: "TCYP4hBtP2wpG2YX",
            name: "테스트계정",
            title: "GS25 서울역점",
            content: "오후타임",
            dayOfWeek: 1,
            startTime: "12:00:00",
            endTime: "18:00:00",
          },
        ],
      },
    },
    parameters: {
      storeId: {
        in: "path",
        name: "storeId",
        required: true,
        description: "가게 아이디 (8자)",
        schema: {
          type: "string",
        },
      },
      scheduleId: {
        in: "path",
        name: "scheduleId",
        required: true,
        description: "일정 아이디 (16자)",
        schema: {
          type: "string",
        },
      },
      memberId: {
        in: "path",
        name: "storeId",
        required: true,
        description: "직원 아이디 (12자)",
        schema: {
          type: "string",
        },
      },
    }
  },
};

const outputFile = path.join(__dirname, "../../dist/swagger-output.json");
const endpointsFiles = [path.join(__dirname, "../app.ts")];

fs.mkdir(path.dirname(outputFile), { recursive: true });

const generateSwagger = swaggerAutogen({ openapi: "3.1.1" })(outputFile, endpointsFiles, doc);

export default generateSwagger;

export const setupSwagger = async (app: Express): Promise<boolean> => {
  try {
    await (
      await import("@/config/swagger")
    ).default;

    try {
      await fs.access(outputFile);
      const swaggerDocument = await import(outputFile);
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
