import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("schedule").modifyColumn("id", "varchar(12)").execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("schedule").modifyColumn("id", "varchar(16)").execute();
}
