import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
	
	await db.schema
	.alterTable("store_member")
	.dropConstraint("store_member_user_id_fk")
	.execute();
	
	await sql`ALTER TABLE store_member DROP PRIMARY KEY`.execute(db);
	
	await db.schema
		.alterTable('store_member')
		.addForeignKeyConstraint("store_member_user_id_fk", ["user_id"], "user", ["id"])
		.execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema
		.alterTable('store_member')
		.addPrimaryKeyConstraint("store_member_pk", ["user_id"])
		.execute();
}
