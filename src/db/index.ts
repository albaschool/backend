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
      return next();
    },
  }),
});

export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin(), new DeduplicateJoinsPlugin()],
  log(event) {
    if (event.level !== "error") {
      logger.debug(
        {
          durationMs: event.queryDurationMillis,
          sql: event.query.sql,
          params: event.query.parameters,
        },
        "Query executed:",
      );
      return;
    }
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
