import api, { multipartApi } from "../lib/axios";

const upload = {
  // Upload a course/lesson thumbnail directly through the backend (multer-s3).
  // Returns { url, key, size, mimetype }.
  uploadThumbnail: (file, onUploadProgress) => {
    const fd = new FormData();
    fd.append("thumbnail", file);
    return multipartApi.post("/uploads/thumbnail", fd, { onUploadProgress });
  },

  // Ask the backend for an S3 PUT presigned URL for direct browser → S3 upload.
  // Returns { uploadUrl, key, publicUrl }.
  presignVideo: ({ contentType, fileName }) =>
    api.post("/uploads/video/presign", { contentType, fileName }),

  // Perform the direct PUT upload to S3 using the presigned URL.
  putToPresignedUrl: (uploadUrl, file, onProgress) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`S3 upload failed (${xhr.status})`));
      };
      xhr.onerror = () => reject(new Error("S3 upload network error"));
      xhr.send(file);
    }),
};

export default upload;

