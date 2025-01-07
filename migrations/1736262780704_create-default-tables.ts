import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "varchar(12)", (col) => col.primaryKey())
    .addColumn("email", "varchar(255)", (col) => col.notNull())
    .addColumn("password", "varchar(255)", (col) => col.notNull())
    .addColumn("name", "varchar(20)", (col) => col.notNull())
    .addColumn("contact", "varchar(11)", (col) => col.notNull())
    .addColumn("role", "varchar(7)", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("store")
    .addColumn("id", "varchar(8)", (col) => col.primaryKey())
    .addColumn("owner_id", "varchar(12)", (col) => col.notNull())
    .addColumn("title", "varchar(255)", (col) => col.notNull())
    .addColumn("location", "varchar(255)", (col) => col.notNull())
    .addColumn("contact", "varchar(11)", (col) => col.notNull())
    .addColumn("password", "varchar(255)", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addForeignKeyConstraint("store_owner_id_fk", ["owner_id"], "user", ["id"])
    .execute();

  await db.schema
    .createTable("store_member")
    .addColumn("user_id", "varchar(12)", (col) => col.primaryKey())
    .addColumn("store_id", "varchar(8)", (col) => col.notNull())
    .addForeignKeyConstraint("store_member_user_id_fk", ["user_id"], "user", ["id"])
    .addForeignKeyConstraint("store_member_store_id_fk", ["store_id"], "store", ["id"])
    .execute();

  await db.schema
    .createTable("chat_room")
    .addColumn("id", "varchar(8)", (col) => col.primaryKey())
    .addColumn("store_id", "varchar(8)", (col) => col.notNull())
    .addColumn("title", "varchar(255)", (col) => col.notNull())
    .addForeignKeyConstraint("chat_room_store_id_fk", ["store_id"], "store", ["id"])
    .execute();

  await db.schema
    .createTable("chat_room_member")
    .addColumn("room_id", "varchar(8)", (col) => col.notNull())
    .addColumn("user_id", "varchar(12)", (col) => col.notNull())
    .addForeignKeyConstraint("chat_room_member_room_id_fk", ["room_id"], "chat_room", ["id"])
    .addForeignKeyConstraint("chat_room_member_user_id_fk", ["user_id"], "user", ["id"])
    .execute();

  await db.schema
    .createTable("message")
    .addColumn("id", "varchar(12)", (col) => col.primaryKey())
    .addColumn("room_id", "varchar(8)", (col) => col.notNull())
    .addColumn("sender_id", "varchar(12)", (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addForeignKeyConstraint("message_room_id_fk", ["room_id"], "chat_room", ["id"])
    .addForeignKeyConstraint("message_sender_id_fk", ["sender_id"], "user", ["id"])
    .execute();

  await db.schema
    .createTable("schedule")
    .addColumn("id", "varchar(16)", (col) => col.primaryKey())
    .addColumn("user_id", "varchar(12)", (col) => col.notNull())
    .addColumn("store_id", "varchar(8)", (col) => col.notNull())
    .addColumn("day_of_week", sql`TINYINT`, (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("start_at", "timestamp", (col) => col.notNull())
    .addColumn("end_at", "timestamp", (col) => col.notNull())
    .addForeignKeyConstraint("schedule_user_id_fk", ["user_id"], "user", ["id"])
    .addForeignKeyConstraint("schedule_store_id_fk", ["store_id"], "store", ["id"])
    .execute();

  await db.schema
    .createTable("education_page")
    .addColumn("id", "varchar(12)", (col) => col.primaryKey())
    .addColumn("store_id", "varchar(8)", (col) => col.notNull())
    .addColumn("title", "varchar(255)", (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("img", "varchar(255)")
    .addForeignKeyConstraint("education_page_store_id_fk", ["store_id"], "store", ["id"])
    .execute();

  await db.schema
    .createTable("verification")
    .addColumn("name", "varchar(20)", (col) => col.notNull())
    .addColumn("email", "varchar(255)", (col) => col.notNull())
    .addColumn("code", "varchar(8)", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("store_member").execute();
  await db.schema.dropTable("chat_room_member").execute();
  await db.schema.dropTable("message").execute();
  await db.schema.dropTable("schedule").execute();
  await db.schema.dropTable("education_page").execute();
  await db.schema.dropTable("verification").execute();
  await db.schema.dropTable("chat_room").execute();
  await db.schema.dropTable("store").execute();
  await db.schema.dropTable("user").execute();
}
