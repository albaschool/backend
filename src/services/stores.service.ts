import { sql } from "kysely";
import { nanoid } from "nanoid";

import { db } from "@/db";
import { CreateStorePayload, UpdateStorePayload } from "@/interfaces/stores.interface";

export const getStores = async (userId?: string) => {
  const stores = await db
    .selectFrom("store")
    .select(["id", "title", "location", "openTime", "closeTime"])
    .$if(!!userId, (q) => q.where("ownerId", "=", userId!))
    .execute();

  return stores;
};

export const getStoreById = async (storeId: string) => {
  const store = await db
    .selectFrom("store")
    .select(["title", "location", "contact"])
    .where("id", "=", storeId)
    .executeTakeFirst();

  return store;
};

export const getStoreMembers = async (storeId: string) => {
  const members = await db
    .selectFrom("storeMember")
    .innerJoin("user", (join) =>
      join.onRef("storeMember.userId", "=", "user.id").on("storeMember.storeId", "=", storeId),
    )
    .select(["user.id", "user.name", "user.contact"])
    .execute();

  return members;
};

export const createStore = async (payload: CreateStorePayload) => {
  const { ownerId, title, location, contact, password, openTime, closeTime } = payload;

  const store = await db
    .insertInto("store")
    .values({ id: nanoid(8), ownerId, title, location, contact, password, openTime, closeTime })
    .executeTakeFirst();

  return store;
};

export const addStoreMember = async (storeId: string, userId: string) => {
  const result = await db.insertInto("storeMember").values({ storeId, userId }).executeTakeFirst();

  return result;
};

export const deleteStoreMember = async (storeId: string, memberId: string) => {
  const result = await db
    .deleteFrom("storeMember")
    .where("storeId", "=", storeId)
    .where("userId", "=", memberId)
    .executeTakeFirst();

  return result;
};

export const updateStoreById = async (storeId: string, payload: Partial<UpdateStorePayload>) => {
  const result = await db
    .updateTable("store")
    .set(payload)
    .where("id", "=", storeId)
    .executeTakeFirst();

  return result;
}

export const isUserExists = async (userId: string) => {
  const result = await db
    .selectFrom("user")
    .select(sql`1`.as("exists"))
    .where("id", "=", userId)
    .executeTakeFirst();

  return result !== undefined;
};

export const isOwner = async (userId: string, storeId: string) => {
  const result = await db
    .selectFrom("store")
    .select(sql`1`.as("exists"))
    .where("id", "=", storeId)
    .where("ownerId", "=", userId)
    .executeTakeFirst();

  return result !== undefined;
};

export const isStoreMember = async (userId: string, storeId: string) => {
  const result = await db
    .selectFrom("storeMember")
    .select(sql`1`.as("exists"))
    .where("userId", "=", userId)
    .where("storeId", "=", storeId)
    .executeTakeFirst();

  return result !== undefined;
};
