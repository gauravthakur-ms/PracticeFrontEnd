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
router.use(
  validateUserPermission([
    UserRolesEnum.SUPER_ADMIN,
    UserRolesEnum.CUSTOMER_PANEL_ADMIN,
  ]),
);

const paged = (req) => {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "20", 10)));
  return { skip: (page - 1) * limit, limit, page };
};

const list = (Model, opts = {}) =>
  asyncHandler(async (req, res) => {
    const { skip, limit, page } = paged(req);
    let query = Model.find(opts.filter || {}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    if (opts.populate) query = query.populate(opts.populate);
    if (opts.select) query = query.select(opts.select);
    const [data, total] = await Promise.all([
      query.exec(),
      Model.countDocuments(opts.filter || {}),
    ]);
    return res.status(200).json(
      new ApiResponse(200, { data, page, limit, total }, "fetched"),
    );
  });

router.get("/users", list(User, { select: "-password -refreshToken" }));
router.get("/courses", list(Course, { populate: { path: "createdBy", select: "userName email" } }));
router.get("/subjects", list(Subject, { populate: { path: "course", select: "title" } }));
router.get("/lessons", list(Lesson, { populate: { path: "subject", select: "title" } }));
router.get("/reviews", list(Review, { populate: [
  { path: "createdBy", select: "userName email" },
  { path: "course", select: "title" },
]}));
router.get("/orders", list(Order, { populate: [
  { path: "createdBy", select: "userName email" },
  { path: "course", select: "title" },
]}));
router.get("/admin-requests", list(AdminRequest, { populate: { path: "user", select: "userName email" } }));

export default router;
