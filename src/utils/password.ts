import crypto from "crypto";

export const createSalt = async () => {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) reject(err);
      resolve(buf.toString("base64"));
    });
  });
};

export const createHashedPassword = async (password: string, salt: string) => {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, salt, 97581, 64, "sha512", (err, key) => {
      if (err) reject(err);
      resolve(key.toString("base64"));
    });
  });
};

export const comparePassword = async (hashedPassword: string, password: string, salt: string) => {
  const inputHashedPassword = await createHashedPassword(password, salt);
  return inputHashedPassword === hashedPassword;
};
