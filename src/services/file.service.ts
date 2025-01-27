import { nanoid } from "nanoid";

import { bucket } from "@/config/r2";
import logger from "@/logger";

const mimeToExt: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export const uploadFileToR2 = async (type: "profile", fileData: Buffer, mimeType: string): Promise<string> => {
  try {
    // Validate file size
    if (fileData.length > 1024 * 1024 * 5) {
      throw new Error("File size exceeds limit");
    }

    const ext = mimeToExt[mimeType];
    if (!ext) {
      throw new Error("Unsupported file type");
    }

    // Remove leading slash to prevent path issues
    const fileName = `${type}/${nanoid(24)}${ext}`;

    try {
      const response = await bucket.upload(fileData, fileName, {
        contentType: mimeType,
      });

      if (!response || !response.objectKey) {
        throw new Error("Upload failed - no object key returned");
      }

      logger.info(`File uploaded successfully: ${fileName}`);
      return response.objectKey;
    } catch (error) {
      logger.error(`R2 upload error details: ${JSON.stringify(error)}`);
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  } catch (error) {
    logger.error(`File service error: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
};

export const deleteFileFromR2 = async (objectKey: string): Promise<void> => {
  await bucket.deleteObject(objectKey);
};
