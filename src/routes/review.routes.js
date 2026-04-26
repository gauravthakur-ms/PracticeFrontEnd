import express from "express";
import {
  verifyJWT,
  validateUserPermission,
} from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../utils/constant.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  createReviewValidator,
  updateReviewStatusValidator,
} from "../validators/index.js";
import {
  createReview,
  getCourseReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} from "../controllers/review.controllers.js";

// mergeParams so :courseId works when nested under /courses/:courseId/reviews
const router = express.Router({ mergeParams: true });

const adminOnly = validateUserPermission([
  UserRolesEnum.SUPER_ADMIN,
  UserRolesEnum.COURSE_ADMIN,
]);

// Optional JWT for read; required for write. We keep two routers visible:
// - GET / behaves differently for admin vs public via verifyJWT-optional pattern
// For simplicity, require JWT on all endpoints; public unauth users still see only approved
// via the controller logic when no req.user (we still allow no-token GET below).

// Public read: reviews for a course (only approved if no/non-admin user)
// We mount verifyJWT only on writes to keep GET public.
router.get("/", (req, res, next) => {
  // attempt to attach user but do not fail if missing
  if (!req.headers.authorization && !req.cookies?.accessToken) return next();
  return verifyJWT(req, res, (err) => (err ? next() : next()));
}, (req, res, next) => {
  // when mounted at /api/v1/reviews, courseId is undefined → list all
  if (!req.params.courseId) return getAllReviews(req, res, next);
  return getCourseReviews(req, res, next);
});

// Authenticated writes
router.use(verifyJWT);

router.post("/", createReviewValidator(), validate, createReview);

router
  .route("/:reviewId")
  .put(adminOnly, updateReviewStatusValidator(), validate, updateReviewStatus)
  .delete(adminOnly, deleteReview);

export default router;
