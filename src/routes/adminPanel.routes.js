import express from "express";
import {
  verifyJWT,
  validateUserPermission,
} from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../utils/constant.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { User } from "../models/user.models.js";
import { Course } from "../models/course.models.js";
import { Subject } from "../models/subject.models.js";
import { Lesson } from "../models/lesson.models.js";
import { Review } from "../models/review.models.js";
import { Order } from "../models/order.models.js";
import { AdminRequest } from "../models/adminRequest.models.js";

const router = express.Router();
router.use(verifyJWT);

// Anyone with an admin-ish role can hit this router; per-route guards below
// enforce who can see which collections.
const anyAdmin = validateUserPermission([
  UserRolesEnum.SUPER_ADMIN,
  UserRolesEnum.CUSTOMER_PANEL_ADMIN,
  UserRolesEnum.COURSE_ADMIN,
]);
router.use(anyAdmin);

const platformAdminOnly = validateUserPermission([
  UserRolesEnum.SUPER_ADMIN,
  UserRolesEnum.CUSTOMER_PANEL_ADMIN,
]);

const paged = (req) => {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "20", 10)));
  return { skip: (page - 1) * limit, limit, page };
};

const list = (Model, opts = {}) =>
  asyncHandler(async (req, res) => {
    const { skip, limit, page } = paged(req);
    const baseFilter =
      typeof opts.filter === "function" ? await opts.filter(req) : opts.filter || {};
    let query = Model.find(baseFilter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    if (opts.populate) query = query.populate(opts.populate);
    if (opts.select) query = query.select(opts.select);
    const [data, total] = await Promise.all([
      query.exec(),
      Model.countDocuments(baseFilter),
    ]);
    return res.status(200).json(
      new ApiResponse(200, { data, page, limit, total }, "fetched"),
    );
  });

// Course admins should only see their own courses (and related subjects /
// lessons / reviews / orders). Platform admins see everything.
const ownCoursesFilter = async (req) => {
  if (req.user.role === UserRolesEnum.COURSE_ADMIN) {
    return { createdBy: req.user._id };
  }
  return {};
};

const ownCourseIds = async (req) => {
  if (req.user.role !== UserRolesEnum.COURSE_ADMIN) return null;
  const ids = await Course.find({ createdBy: req.user._id }).distinct("_id");
  return ids;
};

const scopedByCourseFilter = (field) => async (req) => {
  const ids = await ownCourseIds(req);
  if (ids === null) return {};
  return { [field]: { $in: ids } };
};

router.get("/users", platformAdminOnly, list(User, { select: "-password -refreshToken" }));
router.get(
  "/courses",
  list(Course, {
    filter: ownCoursesFilter,
    populate: { path: "createdBy", select: "userName email" },
  }),
);
router.get(
  "/subjects",
  list(Subject, {
    filter: scopedByCourseFilter("course"),
    populate: { path: "course", select: "title" },
  }),
);
router.get(
  "/lessons",
  list(Lesson, {
    filter: scopedByCourseFilter("course"),
    populate: { path: "subject", select: "title" },
  }),
);
router.get(
  "/reviews",
  list(Review, {
    filter: scopedByCourseFilter("course"),
    populate: [
      { path: "createdBy", select: "userName email" },
      { path: "course", select: "title" },
    ],
  }),
);
router.get(
  "/orders",
  list(Order, {
    filter: scopedByCourseFilter("course"),
    populate: [
      { path: "createdBy", select: "userName email" },
      { path: "course", select: "title" },
    ],
  }),
);
router.get(
  "/admin-requests",
  platformAdminOnly,
  list(AdminRequest, { populate: { path: "user", select: "userName email" } }),
);

export default router;
