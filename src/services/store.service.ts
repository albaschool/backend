import { db } from "@/db";

export const getAllStores = async () => {
  const stores = await db
    .selectFrom("store")
    .select(["id", "title", "location"])
    .execute();

  return stores;
};