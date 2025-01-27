import { nanoid } from "nanoid";

import { bucket } from "@/config/r2";

const mimeToExt: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

export const uploadFileToR2 = async (type: "profile", fileData: Buffer, mimeType: string): Promise<string> => {
  const ext = mimeToExt[mimeType];
  if (!ext) {
    throw new Error("Unsupported file type");
  }

  const fileName = `/${type}/${nanoid(24)}${ext}`;
  const response = await bucket.upload(fileData, fileName);
  
  return `/${response.objectKey}`;
}