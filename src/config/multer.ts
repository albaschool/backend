import multer, { Options } from "multer";

export const multerImageConfig: Options = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: (_, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("이미지 파일만 업로드 가능합니다."));
    }
  },
};
