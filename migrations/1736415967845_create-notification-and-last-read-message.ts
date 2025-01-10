import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("last_read_message")
    .addColumn("user_id", "varchar(12)", (col) => col.notNull())
    .addColumn("room_id", "varchar(8)", (col) => col.notNull())
    .addColumn("message_id", "varchar(12)", (col) => col.notNull())
		.addForeignKeyConstraint("last_read_messages_user_id_fk", ["user_id"], "user", ["id"])
		.addForeignKeyConstraint("last_read_messages_room_id_fk", ["room_id"], "chat_room", ["id"])
		.addForeignKeyConstraint("last_read_messages_message_id_fk", ["message_id"], "message", ["id"])
    .execute();

  await db.schema
    .createTable("notification")
    .addColumn("id", "varchar(12)", (col) => col.primaryKey())
    .addColumn("user_id", "varchar(12)", (col) => col.notNull())
    .addColumn("content", "varchar(255)", (col) => col.notNull())
    .addColumn("target", "varchar(255)", (col) => col.notNull())
    .addColumn("is_checked", "boolean", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addForeignKeyConstraint("notification_user_id", ["user_id"], "user", ["id"])
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("last_read_message").execute();
  await db.schema.dropTable("notification").execute();
}

