import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("user").modifyColumn("contact", "varchar(12)").execute();
  await db.schema.alterTable("store").modifyColumn("contact", "varchar(12)").execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("user").modifyColumn("contact", "varchar(11)").execute();
  await db.schema.alterTable("store").modifyColumn("contact", "varchar(11)").execute();
}
