import { sql } from "kysely";
import { nanoid } from "nanoid";

import { db } from "@/db";
import { AddStorePayload } from "@/interfaces/stores.interface";

export const getStoresService = async (userId?: string) => {
  const stores = await db
    .selectFrom("store")
    .select(["id", "title", "location"])
    .$if(!!userId, (q) => q.where("ownerId", "=", userId!))
    .execute();

  return stores;
};

export const getStoreByIdService = async (storeId: string) => {
  const store = await db
    .selectFrom("store")
    .select(["title", "location", "contact"])
    .where("id", "=", storeId)
    .executeTakeFirst();

  return store;
};

export const getStoreMembersService = async (storeId: string) => {
  const members = await db
    .selectFrom("storeMember")
    .innerJoin("user", (join) =>
      join.onRef("storeMember.userId", "=", "user.id").on("storeMember.storeId", "=", storeId),
    )
    .select(["user.id", "user.name", "user.contact"])
    .execute();

  return members;
};

export const isOwnerService = async (userId: string, storeId: string) => {
  const result = await db
    .selectFrom("store")
    .select(sql`1`.as('exists'))
    .where("id", "=", storeId)
    .where("ownerId", "=", userId)
    .executeTakeFirst();

  return result !== undefined;
}

export const addStoreService = async (payload: AddStorePayload) => {
  const { ownerId, title, location, contact, password } = payload;

  const store = await db
    .insertInto("store")
    .values({ id: nanoid(8), ownerId, title, location, contact, password })
    .executeTakeFirst();

  return store;
}

export const deleteStoreMemberService = async (storeId: string, memberId: string) => {
  const result = await db
    .deleteFrom("storeMember")
    .where("storeId", "=", storeId)
    .where("userId", "=", memberId)
    .executeTakeFirst();

  return result;
}
