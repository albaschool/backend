"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDbEstablished = exports.db = void 0;
const kysely_1 = require("kysely");
const mysql2_1 = require("mysql2");
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../config/logger"));
const dialect = new kysely_1.MysqlDialect({
    pool: (0, mysql2_1.createPool)({
        uri: config_1.default.database.url,
        typeCast(field, next) {
            if (field.type === "TINY" && field.length === 1) {
                return field.string() === "1";
            }
            return next();
        },
    }),
});
exports.db = new kysely_1.Kysely({
    dialect,
    plugins: [new kysely_1.CamelCasePlugin(), new kysely_1.DeduplicateJoinsPlugin()],
    log(event) {
        if (event.level !== "error")
            return;
        logger_1.default.error({
            durationMs: event.queryDurationMillis,
            error: event.error,
            sql: event.query.sql,
            params: event.query.parameters,
        }, "Query failed:");
    },
});
const checkDbEstablished = () => {
    (0, kysely_1.sql) `SELECT 1`
        .execute(exports.db)
        .then(() => {
        logger_1.default.info("Database connection established.");
    })
        .catch((error) => {
        logger_1.default.error(error, "Database connection failed:");
        process.exit(1);
    });
};
exports.checkDbEstablished = checkDbEstablished;
