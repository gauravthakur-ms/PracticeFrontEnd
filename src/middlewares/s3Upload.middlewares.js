import multer from "multer";
import multerS3 from "multer-s3";
import { getS3Client } from "../utils/s3.js";

// In-memory storage (dev) — server uploads to S3 in controller using PutObject
const memoryStorage = multer.memoryStorage();

export const memoryUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB cap for video
});

// Direct multer-s3 storage (used when bucket configured)
export const buildS3Upload = ({ folder = "uploads", maxBytes = 200 * 1024 * 1024 } = {}) =>
  multer({
    storage: multerS3({
      s3: getS3Client(),
      bucket: process.env.AWS_S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const safe = file.originalname.replace(/\s+/g, "_");
        cb(null, `${folder}/${Date.now()}-${safe}`);
      },
    }),
    limits: { fileSize: maxBytes },
  });
