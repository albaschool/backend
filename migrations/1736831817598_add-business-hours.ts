import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("store")
    .addColumn("open_time", "time", (col) => col.notNull())
    .addColumn("close_time", "time", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("store").dropColumn("open_time").dropColumn("close_time").execute();
}
