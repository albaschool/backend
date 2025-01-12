import { sql } from "kysely";
import { nanoid } from "nanoid";

import { db } from "@/db";
import { RegistRequest } from "@/interfaces/request/auth/registerRequest";


export const saveCode = async (email : string , code : string) => {
    const result = await db.insertInto('verification')
            .values({
                code : code,
                email : email,
            }).executeTakeFirst();
    return result;
}

export const verifyEmail = async (email : string, code : string) => {
    const result = await db.selectFrom("verification")
                            .select(sql`1`.as('exist'))
                            .where(({eb, and})=> 
                                and([eb('code', '=', code), 
                                    eb('email', '=', email)]
                            )
                        ).executeTakeFirst();

    if (result!==undefined) return false;
    else return true;
};

export const saveUser = async (auth : RegistRequest) =>{
    const {name, password, contact, role, email} = auth;
    const result = await db
                            .insertInto("user")
                            .values({id : nanoid(12), password, email, contact, role, name})
                            .executeTakeFirst();
    return result;   
}

export const isUser = async (email : string, password : string) => {
    const user = await db.selectFrom('user')
                            .select(['id', 'name', 'role'])
                            .where(({eb, and})=> 
                                    and([eb('email', '=', email), 
                                        eb('password', '=', password)]))
                            .executeTakeFirst();
    return user;
}

export const updatePassword = async (password : string, id : string)=>{
    const result = await db.updateTable('user')
                            .set({
                                password: password,
                              })
                              .where('id', '=', id)
                              .executeTakeFirst()
    return result;
}