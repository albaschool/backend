import { nanoid } from "nanoid";

import { db } from "@/db";
import { defaultContent } from "@/interfaces/edu.interface";

export const createDefaultPages = async (storeId: string, type: string) => {
  const titles = await db.selectFrom("defaultPage").select(["title"]).where("type", "=", type).execute();

  for (let i = 0; i < titles.length; i++) {
    const title = titles[i].title;
    const result = await db
      .insertInto("educationPage")
      .values({ id: nanoid(12), title, content: defaultContent, storeId })
      .executeTakeFirst();
    if (result.numInsertedOrUpdatedRows === BigInt(0)) return false;
  }
  return true;
};
