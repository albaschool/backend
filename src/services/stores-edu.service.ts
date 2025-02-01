import { sql } from "kysely";
import { nanoid } from "nanoid";

import { db } from "@/db";
import { CreateEducationPayload } from "@/interfaces/edu.interface";

export const isStoreMember = async (storeId: string, userId: string) => {
  return db
    .selectFrom("storeMember")
    .select(sql`1`.as("exists"))
    .where("userId", "=", userId)
    .where("storeId", "=", storeId)
    .executeTakeFirst();
};

export const getEducationsById = async (storeId: string) => {
  return db
    .selectFrom("educationPage")
    .select(["id", "title", "content", "img", "createdAt"])
    .where("storeId", "=", storeId)
    .execute();
};

export const createEducation = async (payload: CreateEducationPayload, storeId: string) => {
  return db
    .insertInto("educationPage")
    .values({
      ...payload,
      id: nanoid(12),
      storeId,
    })
    .executeTakeFirst();
};

export const updateEducationById = async (eduId: string, payload: Partial<CreateEducationPayload>) => {
  return db
    .updateTable("educationPage")
    .set({
      ...payload
    })
    .where("id", "=", eduId)
    .executeTakeFirst();
};

export const deleteEducationById = async (eduId: string) => {
  return await db.deleteFrom("educationPage").where("id", "=", eduId).executeTakeFirst();
};
