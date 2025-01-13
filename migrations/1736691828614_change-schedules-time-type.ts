import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("schedule")
    .modifyColumn("start_time", "time(0)", (col) => col.notNull())
    .modifyColumn("end_time", "time(0)", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("schedule")
    .modifyColumn("start_time", "timestamp", (col) => col.notNull())
    .modifyColumn("end_time", "timestamp", (col) => col.notNull())
    .execute();
}
