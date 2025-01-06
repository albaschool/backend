import { CamelCasePlugin, Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";

import config from "@/config";
import { Database } from "@/db/types";

const dialect = new MysqlDialect({
  pool: createPool(config.database.url),
});

export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
