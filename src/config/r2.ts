import { R2 } from "node-cloudflare-r2";

import config from "@/config";
import logger from "@/logger";

const r2 = new R2({
  accountId: config.cloudflare.accountId,
  accessKeyId: config.cloudflare.accessKeyId,
  secretAccessKey: config.cloudflare.secretAccessKey,
});

export const bucket = r2.bucket(config.cloudflare.bucketName);

export const checkR2Bucket = async () => {
  if (!(await bucket.exists())) {
    logger.error("R2 Bucket does not exist");
  }
};
