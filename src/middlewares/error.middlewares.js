import mongoose from "mongoose";
import { ApiError } from "../utils/api-error.js";

// Normalize any thrown value into an ApiError
const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  let statusCode =
    err.statusCode || (err instanceof mongoose.Error ? 400 : 500);
  let message = err.message || "Internal server error";

  // Mongo duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {}).join(", ");
    message = `Duplicate value for field: ${field}`;
  }

  return new ApiError(statusCode, message, err.errors || [], err.stack);
};

// 404 handler - mount AFTER all routes
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Global error handler - must have 4 args
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const apiError = normalizeError(err);
  const payload = {
    statusCode: apiError.statusCode,
    success: false,
    message: apiError.message,
    errors: apiError.error || [],
  };
  if (process.env.NODE_ENV !== "production") {
    payload.stack = apiError.stack;
  }
  res.status(apiError.statusCode).json(payload);
};

export { errorHandler, notFoundHandler };
