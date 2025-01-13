import { sql } from "kysely";
import { nanoid } from "nanoid";

import { db } from "@/db";
import { CreateSchedulePayload } from "@/interfaces/schedules.interface";

export const getSchedulesByUser = async (userId: string) => {
  const schedules = await db
    .selectFrom("schedule")
    .innerJoin("store", "store.id", "schedule.storeId")
    .select(["schedule.id", "store.title", "content", "dayOfWeek", "startTime", "endTime"])
    .where("userId", "=", userId)
    .execute();

  return schedules;
};

export const getSchedulesByStore = async (storeId: string) => {
  const schedules = await db
    .selectFrom("schedule")
    .innerJoin("user", "user.id", "schedule.userId")
    .innerJoin("store", "store.id", "schedule.storeId")
    .select(["schedule.id", "user.name", "store.title", "content", "dayOfWeek", "startTime", "endTime"])
    .where("storeId", "=", storeId)
    .execute();

  return schedules;
};

export const createSchedule = async (payload: CreateSchedulePayload) => {
  const { userId, storeId, content, dayOfWeek, startTime, endTime } = payload;
  const schedule = await db
    .insertInto("schedule")
    .values({ id: nanoid(16), userId, storeId, content, dayOfWeek, startTime, endTime })
    .executeTakeFirst();

  return schedule;
};

export const updateSchedule = async (scheduleId: string, payload: CreateSchedulePayload) => {
  const { dayOfWeek, content, startTime, endTime } = payload;
  const result = await db
    .updateTable("schedule")
    .set({ dayOfWeek, content, startTime, endTime })
    .where("id", "=", scheduleId)
    .executeTakeFirst();

  return result;
}

export const deleteSchedule = async (scheduleId: string) => {
  const result = await db
    .deleteFrom("schedule")
    .where("id", "=", scheduleId)
    .executeTakeFirst();

  return result;
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

export const isStoreOwner = async (userId: string, storeId: string) => {
  const result = await db
    .selectFrom("store")
    .select(sql`1`.as("exists"))
    .where("ownerId", "=", userId)
    .where("id", "=", storeId)
    .executeTakeFirst();

  return result !== undefined;
}

export const getScheduleById = async (scheduleId: string) => {
  const schedule = await db
    .selectFrom("schedule")
    .select(["storeId"])
    .where("id", "=", scheduleId)
    .executeTakeFirst();

  return schedule;
}
