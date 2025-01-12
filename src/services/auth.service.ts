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

export const registUser = async (auth : RegistRequest) =>{
    const {name, password, contact, role, email} = auth;
    const result = await db.insertInto("user").values({id : nanoid(12), password, email, contact, role, name});
    return result;   
}