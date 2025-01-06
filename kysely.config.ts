import { MysqlAdapter, MysqlDriver, MysqlIntrospector, MysqlQueryCompiler } from "kysely";
import { defineConfig } from "kysely-ctl";
import { createPool } from "mysql2";

export default defineConfig({
  dialect: {
    createAdapter: () => new MysqlAdapter(),
    createDriver: () => new MysqlDriver({ pool: createPool(process.env.DATABASE_URL) }),
    createIntrospector: (db) => new MysqlIntrospector(db),
    createQueryCompiler: () => new MysqlQueryCompiler(),
  },
  migrations: {
    migrationFolder: "migrations",
  },
  seeds: {
    seedFolder: "seeds",
  },
});
