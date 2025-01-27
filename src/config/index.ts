import { config as loadEnvFile } from "dotenv";

import logger from "@/logger";

loadEnvFile({
  path: process.env.NODE_ENV === "test" ? `.env.${process.env.NODE_ENV}.local` : `.env`,
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
  jwt: {
    secretKey: getEnvVar("JWT_SECRET_KEY"),
  },
  mail: {
    user: getEnvVar("MAIL_USER"),
    password: getEnvVar("MAIL_PASSWORD"),
  },
  openapi: {
    ntsBusinessman: getEnvVar("OPENAPI_NTS_BUSINESSMAN"),
  },
  validate: {
    privateKey: getEnvVar("VALIDATE_PRIVATE_KEY"),
  },
  cloudflare: {
    accountId: getEnvVar("CF_ACCOUNT_ID"),
    accessKeyId: getEnvVar("CF_ACCESS_KEY_ID"),
    secretAccessKey: getEnvVar("CF_SECRET_ACCESS_KEY"),
    bucketName: getEnvVar("CF_BUCKET_NAME"),
    customDomain: getEnvVar("CF_CUSTOM_DOMAIN"),
  },
};

export default config;
