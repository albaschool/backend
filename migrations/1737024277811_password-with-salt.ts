import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("user")
    .addColumn("salt", "varchar(88)", (col) => col.notNull())
    .execute();
  await db.schema
    .alterTable("store")
    .addColumn("salt", "varchar(88)", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("user").dropColumn("salt").execute();
  await db.schema.alterTable("store").dropColumn("salt").execute();
}
