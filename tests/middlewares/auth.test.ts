import express, { Express, Request, Response } from "express";
import jwt from "jsonwebtoken";
import request from "supertest";

import config from "@/config";
import { AuthPayload } from "@/interfaces/jwt.interface";
import authMiddleware from "@/middlewares/auth.middleware";

describe("JWT 인증 미들웨어", () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(authMiddleware);
    app.get("/", (req: Request, res: Response) => {
      res.send(req.auth);
    });
  });

  it("토큰이 존재하지 않으면 401 반환", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("토큰을 찾을 수 없습니다.");
  });

  it("토큰이 Bearer로 시작하지 않으면 401 반환", async () => {
    const res = await request(app).get("/").set("Authorization", "blablabla");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("토큰을 찾을 수 없습니다.");
  });

  it("토큰이 유효하지 않으면 401 반환", async () => {
    const res = await request(app).get("/").set("Authorization", "Bearer invalid.token");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("토큰이 유효하지 않습니다.");
  });

  it("토큰이 유효하면 다음 미들웨어 실행", async () => {
    const payload: AuthPayload = {
      id: "test",
      name: "Tester",
      role: "staff",
    };
    const token = jwt.sign(payload, config.jwt.secretKey);
    const res = await request(app).get("/").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining(payload));
  });
});
