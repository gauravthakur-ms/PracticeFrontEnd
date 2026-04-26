import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { presignPutUrl, buildS3Url } from "../utils/s3.js";
import crypto from "crypto";

const ensureBucket = () => {
  if (!process.env.AWS_S3_BUCKET_NAME) {
    throw new ApiError(500, "AWS S3 bucket not configured");
  }
};

const uploadThumbnail = asyncHandler(async (req, res) => {
  ensureBucket();
  if (!req.file) throw new ApiError(400, "file is required");
  const url = req.file.location || buildS3Url(req.file.key);
  return res.status(201).json(
    new ApiResponse(
      201,
      { url, key: req.file.key, size: req.file.size, mimetype: req.file.mimetype },
      "Thumbnail uploaded",
    ),
  );
});

const presignVideoUpload = asyncHandler(async (req, res) => {
  ensureBucket();
  const { fileName, contentType } = req.body;
  if (!fileName || !contentType) {
    throw new ApiError(400, "fileName and contentType are required");
  }
  const safe = fileName.replace(/\s+/g, "_");
  const key = `videos/${Date.now()}-${crypto.randomBytes(6).toString("hex")}-${safe}`;
  const uploadUrl = await presignPutUrl({ key, contentType });
  return res.status(200).json(
    new ApiResponse(
      200,
      { uploadUrl, key, publicUrl: buildS3Url(key) },
      "Presigned URL generated",
    ),
  );
});

export { uploadThumbnail, presignVideoUpload };
