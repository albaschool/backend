import { db } from "@/db";

export const getStores = async (userId?: string) => {
  const stores = await db
    .selectFrom("store")
    .select(["id", "title", "location"])
    .$if(!!userId, (q) => q.where("ownerId", "=", userId!))
    .execute();

  return stores;
};
