import request from "supertest";

import defaultRoutes from "@/routes/default.route";

import { app } from "../setup";

app.use("/", defaultRoutes);

describe("default", () => {
  it("GET / - 인덱스 페이지", async () => {
    const res = await request(app).get("/").send();

    expect(res.statusCode).toEqual(200);
  });
});
