import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import passport from "./utils/passport.js";
import cookieParser from "cookie-parser";
import { errorHandler, notFoundHandler } from "./middlewares/error.middlewares.js";

const app = express();

// Security headers
app.use(helmet());

// HTTP request logging (skip in test)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  }),
);

// Stripe webhook MUST receive raw body — mount BEFORE express.json()
import orderRouter, { stripeWebhookRouter } from "./routes/order.routes.js";
app.use("/api/v1/stripe", stripeWebhookRouter);

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Global rate limit on the API surface
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Stricter limit on auth endpoints to slow brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);
app.use("/api/v1/auth/forgot-password", authLimiter);

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Sanatan API is running");
});

// Routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import courseRouter from "./routes/course.routes.js";
import purchaseCourseRouter from "./routes/purchasedCourse.routes.js";
import subjectRouter from "./routes/subject.routes.js";
import lessonRouter from "./routes/lesson.routes.js";
import reviewRouter from "./routes/review.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import adminPanelRouter from "./routes/adminPanel.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/purchased", purchaseCourseRouter);
app.use("/api/v1/courses/:courseId/subjects", subjectRouter);
app.use("/api/v1/courses/:courseId/subjects/:subjectId/lessons", lessonRouter);
app.use("/api/v1/courses/:courseId/orders", orderRouter);
// review endpoints (split: top-level for cross-course admin view; per-course nested)
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/courses/:courseId/reviews", reviewRouter);
app.use("/api/v1/uploads", uploadRouter);
app.use("/api/v1/admin/panel", adminPanelRouter);

// 404 + global error handler (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
