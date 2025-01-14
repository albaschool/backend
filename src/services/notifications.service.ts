import { db } from "@/db";

export const getNotificationByUserId = async (userId: string) => {
  const notifications = await db
    .selectFrom("notification")
    .select(["id", "content", "target", "isChecked", "createdAt"])
    .where("userId", "=", userId)
    .execute();

  return notifications;
};
