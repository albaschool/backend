import { config as loadEnvFile } from "dotenv";

import logger from "@/logger";

loadEnvFile({
  path: process.env.NODE_ENV === "test" ? `.env.${process.env.NODE_ENV}` : `.env`,
});

const getEnvVar = (name: string, defaultValue: string | null = null): string => {
  const value = process.env[name];
  if (value === undefined) {
    if (defaultValue === null) {
      logger.error(`Environment variable "${name}" is required`);
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
};

export default config;