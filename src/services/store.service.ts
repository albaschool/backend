import { sql } from "kysely";

import { db } from "@/db";

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
