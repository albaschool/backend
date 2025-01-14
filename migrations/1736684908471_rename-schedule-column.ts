import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("schedule")
    .renameColumn("start_at", "start_time")
    .renameColumn("end_at", "end_time")
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("schedule")
    .renameColumn("start_time", "start_at")
    .renameColumn("end_time", "end_at")
    .execute();
}
