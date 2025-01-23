import { nanoid } from "nanoid";

import { db } from "@/db";
import {
  academyEdu,
  convenienceAndMartEdu,
  defaultContent,
  entertainmentEdu,
  restaurantAndCafeEdu,
  salesAndServiceEdu,
} from "@/interfaces/edu.interface";

export const createDefaultOfRestaurantAndCafe = async (storeId: string) => {
  for (let i = 0; i < restaurantAndCafeEdu.length; i++) {
    const result = await db
      .insertInto("educationPage")
      .values({ id: nanoid(12), title: restaurantAndCafeEdu[i], content: defaultContent, storeId })
      .executeTakeFirst();
    if (result.numInsertedOrUpdatedRows === BigInt(0)) return false;
  }
  return true;
};

export const createDefaultOfConvenienceAndMart = async (storeId: string) => {
  for (let i = 0; i < convenienceAndMartEdu.length; i++) {
    const result = await db
      .insertInto("educationPage")
      .values({ id: nanoid(12), title: convenienceAndMartEdu[i], content: defaultContent, storeId })
      .executeTakeFirst();
    if (result.numInsertedOrUpdatedRows === BigInt(0)) return false;
  }
  return true;
};

export const createDefaultOfSalesAndService = async (storeId: string) => {
  for (let i = 0; i < salesAndServiceEdu.length; i++) {
    const result = await db
      .insertInto("educationPage")
      .values({ id: nanoid(12), title: salesAndServiceEdu[i], content: defaultContent, storeId })
      .executeTakeFirst();
    if (result.numInsertedOrUpdatedRows === BigInt(0)) return false;
  }
  return true;
};

export const createDefaultOfEntertainment = async (storeId: string) => {
  for (let i = 0; i < entertainmentEdu.length; i++) {
    const result = await db
      .insertInto("educationPage")
      .values({ id: nanoid(12), title: entertainmentEdu[i], content: defaultContent, storeId })
      .executeTakeFirst();
    if (result.numInsertedOrUpdatedRows === BigInt(0)) return false;
  }
  return true;
};

export const createDefaultOfAcademy = async (storeId: string) => {
  for (let i = 0; i < academyEdu.length; i++) {
    const result = await db
      .insertInto("educationPage")
      .values({ id: nanoid(12), title: academyEdu[i], content: defaultContent, storeId })
      .executeTakeFirst();
    if (result.numInsertedOrUpdatedRows === BigInt(0)) return false;
  }
  return true;
};
