import { Express } from "express";
import { promises as fs } from "fs";
import path from "path";
import swaggerAutogen from "swagger-autogen";
import swaggerUi from "swagger-ui-express";
import { pathToFileURL } from "url";

import config from "@/config";
import logger from "@/logger";

const doc = {
  info: {
    version: "1.0.0",
    title: "알바스쿨 API",
    description: "<https://github.com/albaschool/backend>",
  },
  servers: [
    {
      url: `http://localhost:${config.http.port}`,
      description: "로컬 서버",
    },
  ],
  tags: [
    {
      name: "Stores",
      description: "가게 엔드포인트",
    },
    {
      name: "Schedules",
      description: "일정 엔드포인트",
    },
    {
      name: "Notifications",
      description: "알림 엔드포인트",
    },
    {
      name: "Validate",
      description: "검증 엔드포인트",
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
        $openTime: "09:00:00",
        $closeTime: "21:00:00",
        $bizRegistrationNum: "암호화된 사업자 등록번호",
        $type: "음식점/카페",
      },
      updateStore: {
        $title: "GS25 서울역점",
        $location: "서울 용산구 한강대로 401",
        $contact: "0212345678",
        $password: "password",
        $openTime: "07:00:00",
        $closeTime: "19:00:00",
      },
      addMember: {
        $password: "",
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
        content: "오전타임",
        dayOfWeek: 5,
        startTime: "07:00:00",
        endTime: "12:00:00",
      },
      emailSend: {
        email: "example@mail.com",
      },
      emailVerify: {
        email: "example@mail.com",
        code: "00000",
      },
      saveUser: {
        name: "김철수",
        email: "example@mail.com",
        role: "staff",
        password: "0000",
        contact: "01012341234",
      },
      login: {
        email: "example@mail.com",
        password: "example@mail.com",
      },
      password: {
        password: "0000",
      },

      createChatRoom: {
        storeId: "00s012",
        title: "솥뚜껑 삼겹",
      },
      saveLastMessage: {
        chatRoomId: "",
        messageId: "",
      },
    },
    examples: {
      storesExample: {
        value: [
          {
            id: "4uDfVBHq",
            title: "GS25 서울역점",
            location: "서울 용산구 한강대로 401",
            openTime: "09:00:00",
            closeTime: "21:00:00",
          },
        ],
      },
      storeExample: {
        value: {
          title: "GS25 서울역점",
          location: "서울 용산구 한강대로 401",
          contact: "0212345678",
          $openTime: "09:00:00",
          $closeTime: "21:00:00",
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
      notificationsInitialize: {
        description: "최초 연결 시 받는 메시지입니다. 최근 10개의 알림을 최신순으로 받습니다.",
        value: [
          {
            id: "dQk9ZkCMze6y",
            content: "박사장님이 게시글을 추가했습니다.",
            title: "솥뚜껑 삼겹살",
            target: "/pages/2",
            isChecked: false,
            createdAt: "2025-01-14T04:20:50.000Z",
          },
          {
            id: "krzJssbmzKXE",
            content: "김사장님이 게시글을 수정했습니다.",
            title: "솥뚜껑 삼겹살",
            target: "/pages/1",
            isChecked: true,
            createdAt: "2025-01-13T08:06:01.000Z",
          },
        ],
      },
      notification: {
        description: "알림이 생성될 때 받는 메시지입니다.",
        value: {
          id: "17nNjxKohds0",
          content: "박사장님이 게시글을 추가했습니다.",
          title: "솥뚜껑 삼겹살",
          target: "/pages/3",
          isChecked: false,
          createdAt: "2025-01-15T02:10:30.000Z",
        },
      },
      chatRoomExample: {
        value: [
          {
            id: "TCYP4hBtP2wpG2YX",
            title: "GS25 서울역점",
            lastMessage: "고생했다!",
            notReadCount: 1,
            memberCount: 4,
          },
          {
            id: "Eg2NOSD5",
            title: "솥뚜껑 삼겹",
            lastMessage: "hi22",
            notReadCount: 9,
            memberCount: 10,
          },
        ],
      },
      chatRoomDetailExample: {
        members: [
          {
            userId: "",
            name: "김사장",
          },
        ],
        messages: [
          {
            content: "hi",
            name: "김사장",
            id: "O8aZpbWUwYEw",
            createdAt: "2025-01-14 00:44:31",
          },
          {
            content: "hi",
            name: "김사장",
            id: "O8aZpbWUwYEw",
            createdAt: "2025-01-14 00:44:46",
          },
          {
            content: "hi2",
            name: "김사장",
            id: "O8aZpbWUwYEw",
            createdAt: "2025-01-14 00:44:53",
          },
        ],
      },
      getAuthInfoExample: {
        value: [
          {
            name: "김철수",
            email: "example@mail.com",
            contact: "01011112222",
            profile: "https://example.com/profile.jpg",
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
        description: "일정 아이디 (12자)",
        schema: {
          type: "string",
        },
      },
      userId: {
        in: "path",
        name: "userId",
        required: true,
        description: "유저 아이디 (12자)",
        schema: {
          type: "string",
        },
      },
    },
  },
};

const outputFile = path.join(__dirname, "..", "..", "dist", "swagger-output.json");
const endpointsFiles = ["./app.ts"];

fs.mkdir(path.dirname(outputFile), { recursive: true }).catch((error) => {
  if (error.code === "EEXIST") return;
  logger.error(error, "Failed to create swagger-output.json directory.");
});

const generateSwagger = swaggerAutogen({ openapi: "3.1.1" })(outputFile, endpointsFiles, doc);

export default generateSwagger;

export const setupSwagger = async (app: Express): Promise<boolean> => {
  try {
    await (
      await import("@/config/swagger")
    ).default;

    try {
      await fs.access(outputFile);
      const swaggerDocument = await import(pathToFileURL(outputFile).href);
      app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      return true;
    } catch (error) {
      logger.error(error, "swagger-output.json does not exists.");
      return false;
    }
  } catch (error) {
    logger.error(error, "Swagger UI failed to initialize:");
    return false;
  }
};
