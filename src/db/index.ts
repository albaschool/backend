import { CamelCasePlugin, DeduplicateJoinsPlugin, Kysely, MysqlDialect, sql } from "kysely";
import { createPool } from "mysql2";

import config from "@/config";
import { Database } from "@/db/types";
import logger from "@/logger";

const dialect = new MysqlDialect({
  pool: createPool({
    uri: config.database.url,
    typeCast(field, next) {
      if (field.type === "TINY" && field.length === 1) {
        return field.string() === "1";
      }
      if (field.type === "TIMESTAMP") {
        const value = field.string();
        return value ? new Date(new Date(value).getTime() + 9 * 60 * 60 * 1000) : null;
      }
      return next();
    },
  }),
});

export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin(), new DeduplicateJoinsPlugin()],
  log(event) {
    if (event.level !== "error") return;
    logger.error(
      {
        durationMs: event.queryDurationMillis,
        error: event.error,
        sql: event.query.sql,
        params: event.query.parameters,
      },
      "Query failed:",
    );
  },
});

export const checkDbEstablished = () => {
  sql`SELECT 1`
    .execute(db)
    .then(() => {
      logger.info("Database connection established.");
    })
    .catch((error) => {
      logger.error(error, "Database connection failed:");
      process.exit(1);
    });
};
