"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const logger_1 = __importDefault(require("./logger"));
(0, dotenv_1.config)({
    path: process.env.NODE_ENV === "test" ? `.env.${process.env.NODE_ENV}.local` : `.env`,
});
const getEnvVar = (name, defaultValue = null) => {
    const value = process.env[name];
    if (value === undefined) {
        if (defaultValue === null) {
            logger_1.default.error(`Environment variable "${name}" is required`);
            process.exit(1);
        }
        return defaultValue;
    }
    return value;
};
const config = {
    node: {
        env: getEnvVar("NODE_ENV", "development"),
    },
    http: {
        host: getEnvVar("HTTP_HOST", "localhost"),
        port: getEnvVar("HTTP_PORT", "3000"),
        cors: getEnvVar("HTTP_CORS", "").split(","),
    },
    database: {
        url: getEnvVar("DATABASE_URL"),
    },
    jwt: {
        secretKey: getEnvVar("JWT_SECRET_KEY"),
    }
};
exports.default = config;
