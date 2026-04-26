import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.models.js";
import { PurchasedCourse } from "../models/purchasedCourse.models.js";
import { UserRolesEnum, UserCourseStatusEnum } from "../utils/constant.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized, token not found");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Unauthorized, user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized, invalid token");
  }
});

const validateUserPermission = (roles = []) => {
  return asyncHandler((req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access, please login");
    }
    const role = req.user?.role;
    if (!roles.includes(role)) {
      throw new ApiError(403, `${role} is not allowed`);
    }
    next();
  });
};

// Skip purchase requirement for admins; otherwise require an active PurchasedCourse
const requireActivePurchase = asyncHandler(async (req, res, next) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const adminRoles = [UserRolesEnum.SUPER_ADMIN, UserRolesEnum.COURSE_ADMIN];
  if (adminRoles.includes(req.user.role)) return next();

  const courseId = req.params.courseId;
  if (!courseId) throw new ApiError(400, "courseId param required");

  const purchase = await PurchasedCourse.findOne({
    user: req.user._id,
    course: courseId,
    status: UserCourseStatusEnum.Active,
  });
  if (!purchase) {
    throw new ApiError(403, "You must purchase this course to access content");
  }
  if (purchase.validTillDate && purchase.validTillDate < new Date()) {
    throw new ApiError(403, "Your access to this course has expired");
  }
  req.purchase = purchase;
  next();
});

export { verifyJWT, validateUserPermission, requireActivePurchase };
