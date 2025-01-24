import { nanoid } from "nanoid";

import { db } from "@/db";
import { CreateEducationPagePayload, defaultContent } from "@/interfaces/edu.interface";

export const createDefaultPages = async (storeId: string, type: string) => {
  const titles = await db.selectFrom("defaultPage").select(["title"]).where("type", "=", type).execute();

  const insertArray = [];
  for (let i = 0; i < titles.length; i++) {
    const temp: CreateEducationPagePayload = {
      id: "",
      title: "",
      content: "",
      storeId: "",
    };
    temp.id = nanoid(12);
    temp.title = titles[i].title;
    temp.storeId = storeId;
    temp.content = defaultContent;
    insertArray.push(temp);
  }
  const result = await db.insertInto("educationPage").values(insertArray).executeTakeFirst();

  if (result.numInsertedOrUpdatedRows === BigInt(0)) return false;
  return true;
};
