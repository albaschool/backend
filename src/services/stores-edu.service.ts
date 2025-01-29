import { sql } from "kysely";
import { nanoid } from "nanoid";

import { db } from "@/db";
import { CreateEducationPayload } from "@/interfaces/edu.interface";

import { uploadFileToR2 } from "./file.service";

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
  const { img, mimeType, ...education } = payload;

  const imageKey = img && mimeType ? await uploadFileToR2("education", img, mimeType) : null;

  return db
    .insertInto("educationPage")
    .values({
      ...education,
      id: nanoid(12),
      storeId,
      img: imageKey,
    })
    .executeTakeFirst();
};

export const deleteEducationById = async (eduId: string) => {
  return db.deleteFrom("educationPage").where("id", "=", eduId).executeTakeFirst();
};
