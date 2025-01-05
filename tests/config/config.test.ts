describe("Config", () => {
  it("defaultValue가 명시되지 않은 변수 호출 시 에러 발생", async () => {
    await expect(async () => await import("@/config")).rejects.toThrow();
  });

  it("설정되지 않은 값 호출 시 기본값 반환", async () => {
    process.env.DB_USER = "";
    process.env.DB_PASSWORD = "";
    process.env.DB_DATABASE = "";
    const config = (await import("@/config")).default;
    expect(config.http.port).toBe("3000");
  });
});
