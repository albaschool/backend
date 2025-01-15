import { db } from "@/db";

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
