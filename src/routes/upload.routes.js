import express from "express";
import { verifyJWT, validateUserPermission } from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../utils/constant.js";
import { uploadThumbnail, presignVideoUpload } from "../controllers/upload.controllers.js";
import { buildS3Upload } from "../middlewares/s3Upload.middlewares.js";

const router = express.Router();
router.use(verifyJWT);

const adminOnly = validateUserPermission([
  UserRolesEnum.SUPER_ADMIN,
  UserRolesEnum.COURSE_ADMIN,
]);

// Lazily build the multer-s3 instance on first use to avoid throwing when bucket is unset
const thumbnailUploader = (req, res, next) => {
  try {
    return buildS3Upload({ folder: "thumbnails", maxBytes: 5 * 1024 * 1024 }).single("thumbnail")(
      req,
      res,
      next,
    );
  } catch (err) {
    next(err);
  }
};

router.post("/thumbnail", adminOnly, thumbnailUploader, uploadThumbnail);
router.post("/video/presign", adminOnly, presignVideoUpload);

export default router;
