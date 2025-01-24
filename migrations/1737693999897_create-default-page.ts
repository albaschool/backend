import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("default_page")
    .addColumn("type", "varchar(30)", (col) => col.notNull())
    .addColumn("title", "varchar(30)", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("default_page").execute();
}
