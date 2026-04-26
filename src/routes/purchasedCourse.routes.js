import express from "express";
import {
  validateUserPermission,
  verifyJWT,
} from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../utils/constant.js";
import {
  getAllPurchasedCourse,
  getPurchasedCoursesOfUser,
  mostlyPurchasedCourse,
  updatePurchasedCourseStatus,
} from "../controllers/purchasedCourse.controllers.js";
import { updatePurchasedCourseStatusValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middlewares.js";

const router = express.Router();
router.use(verifyJWT);

router.route("/my-course").get(getAllPurchasedCourse);
router
  .route("/users/:userId/courses")
  .get(
    validateUserPermission([
      UserRolesEnum.SUPER_ADMIN,
      UserRolesEnum.COURSE_ADMIN,
      UserRolesEnum.CUSTOMER_PANEL_ADMIN,
    ]),
    getPurchasedCoursesOfUser,
  );

router
  .route("/users/:userId/courses/:courseId")
  .put(
    validateUserPermission([
      UserRolesEnum.SUPER_ADMIN,
      UserRolesEnum.COURSE_ADMIN,
    ]),
    updatePurchasedCourseStatusValidator(),
    validate,
    updatePurchasedCourseStatus,
  );

router
  .route("/mostly-purchased-course")
  .get(
    validateUserPermission([
      UserRolesEnum.SUPER_ADMIN,
      UserRolesEnum.COURSE_ADMIN,
      UserRolesEnum.CUSTOMER_PANEL_ADMIN,
    ]),
    mostlyPurchasedCourse
  );

export default router;
