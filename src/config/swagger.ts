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
      emailSend : {
        "email" : "example@mail.com"
      },
      emailVerify : {
        "email" : "example@mail.com",
        "code" : "00000"
      },
      saveUser : {
        "name" : "김철수",
        "email" : "example@mail.com",
        "role" : "staff",
        "password" : "0000",
        "contact" : "01012341234"
      },
      password : {
        "password" : "0000"
      }
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
    },
  },
};

const outputFile = path.join(__dirname, "../../dist/swagger-output.json");
const endpointsFiles = [path.join(__dirname, "../app.ts")];
console.log("outputFile : " + outputFile);
console.log("endpointFiles : " + endpointsFiles );

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
