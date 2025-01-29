import { sql } from "kysely";

import { db } from "@/db";

export const isStoreMember = async (storeId: string, userId: string) => {
  return db
    .selectFrom("storeMember")
    .select(sql`1`.as("exists"))
    .where("userId", "=", userId)
    .where("storeId", "=", storeId)
    .executeTakeFirst();
}

export const getCoursesById = async (storeId: string) => {
  return db
    .selectFrom("educationPage")
    .select(["id", "title", "content", "img", "createdAt"])
    .where("storeId", "=", storeId)
    .execute();
};
