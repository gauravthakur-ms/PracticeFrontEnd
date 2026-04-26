import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

let s3Singleton = null;

export const getS3Client = () => {
  if (s3Singleton) return s3Singleton;
  if (!process.env.AWS_REGION) {
    throw new Error("AWS_REGION is not configured");
  }
  s3Singleton = new S3Client({
    region: process.env.AWS_REGION,
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined, // fall back to default provider chain
  });
  return s3Singleton;
};

export const buildS3Url = (key) => {
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

export const presignPutUrl = async ({
  key,
  contentType,
  expiresIn = 60 * 10,
}) => {
  const cmd = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(getS3Client(), cmd, { expiresIn });
};

export const deleteS3Object = async (key) => {
  const cmd = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });
  return getS3Client().send(cmd);
};
