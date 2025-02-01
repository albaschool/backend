import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("education_page")
    .dropColumn("img")
		.modifyColumn("content", sql`LONGTEXT`)
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("education_page")
    .addColumn("img", "varchar(255)")
    .modifyColumn("content", sql`TEXT`)
    .execute();
}
