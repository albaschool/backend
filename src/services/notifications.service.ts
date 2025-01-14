import { db } from "@/db";

export const getNotificationsByUserId = async (userId: string, limit: number) => {
  const notifications = await db
    .selectFrom("notification")
    .select(["id", "content", "target", "isChecked", "createdAt"])
    .where("userId", "=", userId)
    .limit(limit)
    .orderBy("createdAt", "desc")
    .execute();

  return notifications;
};
