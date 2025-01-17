import { nanoid } from "nanoid";

import { db } from "@/db";
import { RegistRequest } from "@/interfaces/auth.interface";

export const saveCode = async (email: string, code: string) => {
  const result = await db
    .insertInto("verification")
    .values({
      code: code,
      email: email,
    })
    .executeTakeFirst();
  return result;
};

export const verifyEmail = async (email: string, code: string) => {
  const results = await db.selectFrom("verification").select("code").where("email", "=", email).execute();
  if (results[Object.keys(results).length - 1].code === code) return true;
  else return false;
};

export const saveUser = async (auth: RegistRequest) => {
  const { name, password, contact, role, email, salt } = auth;
  const result = await db
    .insertInto("user")
    .values({ id: nanoid(12), password, email, contact, role, name, salt })
    .executeTakeFirst();
  return result;
};

export const isUser = async (email: string, password: string) => {
  const user = await db
    .selectFrom("user")
    .select(["id", "name", "role"])
    .where(({ eb, and }) => and([eb("email", "=", email), eb("password", "=", password)]))
    .executeTakeFirst();
  return user;
};

export const updatePassword = async (password: string, id: string) => {
  console.log(password);
  const result = await db
    .updateTable("user")
    .set({
      password: password,
    })
    .where("id", "=", id)
    .executeTakeFirst();
  console.log(result);
  return result;
};

export const checkPassword = async (password: string, id: string) => {
  const result = await db.selectFrom("user").where("id", "=", id).select("password").executeTakeFirst();
  return result!.password === password;
};
