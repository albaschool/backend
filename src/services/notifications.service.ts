import { sql } from "kysely";
import { nanoid } from "nanoid";

import { db } from "@/db";
import { CreateNotificationPayload } from "@/interfaces/notifications.interface";

export const getNotificationsByUserId = async (userId: string, limit: number) => {
  const notifications = await db
    .selectFrom("notification")
    .select(["id", "content", "title", "target", "isChecked", "createdAt"])
    .where("userId", "=", userId)
    .limit(limit)
    .orderBy("createdAt", "desc")
    .execute();

  return notifications;
};

export const readAllNotifications = async (userId: string) => {
  const result = await db
    .updateTable("notification")
    .set({ isChecked: true })
    .where("userId", "=", userId)
    .where("isChecked", "=", false)
    .executeTakeFirst();

  return result;
};

export const createNotification = async (notification: CreateNotificationPayload) => {
  const { userId, title, content, target } = notification;

  const result = await db
    .insertInto("notification")
    .values({
      id: nanoid(12),
      userId,
      title,
      content,
      target,
      isChecked: false,
    })
    .executeTakeFirst();

  return result;
};

export const getNameOfDay = (dayOfWeek: number) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[dayOfWeek];
};

export const getStoreNameById = async (storeId: string) => {
  const store = await db.selectFrom("store").select(["title"]).where("id", "=", storeId).executeTakeFirst();

  return store?.title;
};

export const hasUnreadNotification = async (userId: string) => {
  const result = await db
    .selectFrom("notification")
    .select(sql`1`.as("exists"))
    .where("userId", "=", userId)
    .where("isChecked", "=", false)
    .limit(1)
    .executeTakeFirst();

  return !!result;
};