import { db } from "@/db";

export const getSchedulesByUser = async (userId: string) => {
  const schedules = await db
    .selectFrom("schedule")
    .innerJoin("store", "store.id", "schedule.storeId")
    .select(["schedule.id", "store.title", "dayOfWeek", "startTime", "endTime"])
    .where("userId", "=", userId)
    .execute();

  return schedules;
}
