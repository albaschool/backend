import { nanoid } from "nanoid";

import { db } from "@/db";
import { RegistRequest } from "@/interfaces/auth.interface";
import { comparePassword, createHashedPassword, createSalt } from "@/utils/password";

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
    .select(["id", "name", "role", "password", "salt"])
    .where("email", "=", email)
    .executeTakeFirst();

  if (user === undefined) return undefined;

  const { password: userPassword, salt, ...userData } = user;

  if (!(await comparePassword(userPassword, password, salt))) {
    return undefined;
  }

  return userData;
};

export const updatePassword = async (password: string, id: string) => {
  const salt = await createSalt();
  const hashedPassword = await createHashedPassword(password, salt);
  const result = await db
    .updateTable("user")
    .set({
      password: hashedPassword,
      salt,
    })
    .where("id", "=", id)
    .executeTakeFirst();
  return result;
};

export const checkPassword = async (password: string, id: string) => {
  const result = await db.selectFrom("user").select(["password", "salt"]).where("id", "=", id).executeTakeFirst();
  if (result === undefined) return false;
  return await comparePassword(result.password, password, result.salt);
};
