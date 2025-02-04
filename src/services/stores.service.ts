import { sql } from "kysely";
import { nanoid } from "nanoid";

import config from "@/config";
import { db } from "@/db";
import { CreateStorePayload, UpdateStorePayload } from "@/interfaces/stores.interface";

export const getStores = async () => {
  const stores = await db.selectFrom("store").select(["id", "title", "location", "openTime", "closeTime"]).execute();
  return stores;
};

export const getStoresByUserId = async (userId: string) => {
  const stores = await db
    .selectFrom("storeMember")
    .innerJoin("store", "store.id", "storeMember.storeId")
    .select(["store.id", "store.title", "store.location", "store.openTime", "store.closeTime"])
    .where("storeMember.userId", "=", userId)
    .execute();

  return stores;
};

export const getStoreById = async (storeId: string) => {
  const store = await db
    .selectFrom("store")
    .select(["title", "location", "ownerId", "contact", "password", "salt"])
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
    .select(["user.id", "user.name", "user.contact", "user.profile"])
    .execute();

  return members.map(({ profile, ...member }) => ({
    ...member,
    profile: profile ? `https://${config.cloudflare.customDomain}/${profile}` : null,
  }));
};

export const createStore = async (payload: CreateStorePayload) => {
  const { ownerId, title, location, contact, password, openTime, closeTime, salt, bizRegistrationNum } = payload;
  const storeId = nanoid(8);

  const result = await db
    .insertInto("store")
    .values({ id: storeId, ownerId, title, location, contact, password, openTime, closeTime, salt, bizRegistrationNum })
    .executeTakeFirst();

  return { result, storeId };
};

export const addStoreMember = async (storeId: string, userId: string) => {
  const result = await db.insertInto("storeMember").values({ storeId, userId }).executeTakeFirst();

  return result;
};

export const deleteStoreMember = async (storeId: string, userId: string) => {
  const result = await db
    .deleteFrom("storeMember")
    .where("storeId", "=", storeId)
    .where("userId", "=", userId)
    .executeTakeFirst();

  return result;
};

export const updateStoreById = async (storeId: string, payload: Partial<UpdateStorePayload>) => {
  const result = await db.updateTable("store").set(payload).where("id", "=", storeId).executeTakeFirst();

  return result;
};

export const getUser = async (userId: string) => {
  const result = await db
    .selectFrom("user")
    .select("name")
    .where("id", "=", userId)
    .executeTakeFirst();

  return result;
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

export const isStoreMember = async (storeId: string, userId: string) => {
  const result = await db
    .selectFrom("storeMember")
    .select(sql`1`.as("exists"))
    .where("userId", "=", userId)
    .where("storeId", "=", storeId)
    .executeTakeFirst();

  return result !== undefined;
};

export const deleteStoreById = async (storeId: string) => {
  return await db.transaction().execute(async (trx) => {
    const chatRoom = await trx.selectFrom("chatRoom").select("id").where("storeId", "=", storeId).executeTakeFirst();
    if (chatRoom) {
      await trx.deleteFrom("lastReadMessage").where("roomId", "=", chatRoom.id).executeTakeFirst();
      await trx.deleteFrom("message").where("roomId", "=", chatRoom.id).executeTakeFirst();
    }
    await trx.deleteFrom("chatRoom").where("storeId", "=", storeId).executeTakeFirst();
    await trx.deleteFrom("educationPage").where("storeId", "=", storeId).executeTakeFirst();
    await trx.deleteFrom("schedule").where("storeId", "=", storeId).executeTakeFirst();
    await trx.deleteFrom("storeMember").where("storeId", "=", storeId).executeTakeFirst();
    return await trx.deleteFrom("store").where("id", "=", storeId).executeTakeFirst();
  });
};
