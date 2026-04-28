import api from "../lib/axios";

const upload = {
  // Returns { fields, url, key, finalUrl } from presign endpoint
  presignVideo: ({ contentType, sizeBytes, fileName }) =>
    api.post("/uploads/video/presign", { contentType, sizeBytes, fileName }),
  // Multipart S3 thumbnail upload (admin uses /uploads/thumbnail with field "thumbnail")
};

export default upload;
