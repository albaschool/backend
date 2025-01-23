import crypto from "crypto";

import config from "@/config";

export const validateBizRegistrationNum = async (bizRegistrationNum: string): Promise<boolean> => {
  const res = await fetch(
    `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${config.openapi.ntsBusinessman}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        b_no: [bizRegistrationNum],
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const { data } = await res.json();
  return !(data[0]?.["tax_type"]?.includes("등록되지 않은 사업자등록번호") ?? true);
};

export const encrypt = (bizRegistrationNum: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", config.validate.privateKey, iv);
  let encrypted = cipher.update(bizRegistrationNum, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (encrypted: string): string => {
  const [ivHex, encryptedText] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", config.validate.privateKey, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}