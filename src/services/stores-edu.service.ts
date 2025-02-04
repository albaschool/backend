import { sql } from "kysely";
import { nanoid } from "nanoid";

import { db } from "@/db";
import { CreateEducationPayload } from "@/interfaces/edu.interface";

import { createNotification, getStoreNameById } from "./notifications.service";

export const isStoreMember = async (storeId: string, userId: string) => {
  return db
    .selectFrom("storeMember")
    .select(sql`1`.as("exists"))
    .where("userId", "=", userId)
    .where("storeId", "=", storeId)
    .executeTakeFirst();
};

export const getEducationsById = async (storeId: string) => {
  return db.selectFrom("educationPage").select(["id", "title", "createdAt"]).where("storeId", "=", storeId).execute();
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

export const updateEducationById = async (storeId: string, eduId: string, payload: Partial<CreateEducationPayload>) => {
  return db
    .updateTable("educationPage")
    .set({
      ...payload,
    })
    .where("id", "=", eduId)
    .where("storeId", "=", storeId)
    .executeTakeFirst();
};

export const deleteEducationById = async (storeId: string, eduId: string) => {
  return await db.deleteFrom("educationPage").where("id", "=", eduId).where("storeId", "=", storeId).executeTakeFirst();
};

export const getEducationById = async (storeId: string, eduId: string) => {
  return db
    .selectFrom("educationPage")
    .select(["id", "title", "content", "createdAt"])
    .where("id", "=", eduId)
    .where("storeId", "=", storeId)
    .executeTakeFirst();
};

const getStoreMembers = async (storeId: string) => {
  return db.selectFrom("storeMember").select("userId").where("storeId", "=", storeId).execute();
};

export const createEduNoti = async (storeId: string) => {
  const members = await getStoreMembers(storeId);
  const notiTitle = await getStoreNameById(storeId);
  const owner = await db.selectFrom("store").select("ownerId").where("id", "=", storeId).executeTakeFirst();
  for (let i = 0; i < members.length; i++) {
    if (members[i].userId == owner?.ownerId) continue;
    await createNotification({
      content: `게시물이 생성 됐습니다.`,
      target: "/edupost/staff",
      title: notiTitle ?? "알 수 없는 가게",
      userId: members[i].userId,
    });
  }
};

export const updateEduNoti = async (storeId: string) => {
  const members = await getStoreMembers(storeId);
  const title = await getStoreNameById(storeId);
  const owner = await db.selectFrom("store").select("ownerId").where("id", "=", storeId).executeTakeFirst();
  for (let i = 0; i < members.length; i++) {
    if (members[i].userId == owner?.ownerId) continue;
    await createNotification({
      content: `게시물이 수정 됐습니다.`,
      target: `/edupost/staff`,
      title: title ?? "알 수 없는 가게",
      userId: members[i].userId,
    });
  }
};
