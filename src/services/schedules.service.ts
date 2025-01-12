import { sql } from "kysely";

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

export const getSchedulesByStore = async (storeId: string) => {
  const schedules = await db
    .selectFrom("schedule")
    .innerJoin("user", "user.id", "schedule.userId")
    .innerJoin("store", "store.id", "schedule.storeId")
    .select(["schedule.id", "user.name", "store.title", "dayOfWeek", "startTime", "endTime"])
    .where("storeId", "=", storeId)
    .execute();

  return schedules;
};

export const isUserInStore = async (userId: string, storeId: string) => {
  const result = await db
    .selectFrom("schedule")
    .select(sql`1`.as("exists"))
    .where("userId", "=", userId)
    .where("storeId", "=", storeId)
    .executeTakeFirst();

  return result !== undefined;
};