import express from "express";
import {
  verifyJWT,
  validateUserPermission,
} from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../utils/constant.js";
import {
  createCourse,
  deleteCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
} from "../controllers/course.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { createCourseValidator } from "../validators/index.js";

const router = express.Router();

router
  .route("/")
  .post(
    verifyJWT,
    validateUserPermission([
      UserRolesEnum.SUPER_ADMIN,
      UserRolesEnum.COURSE_ADMIN,
    ]),
    createCourseValidator(),
    validate,
    createCourse,
  )
  .get(getAllCourse);

router
  .route("/:courseId")
  .put(
    verifyJWT,
    validateUserPermission([
      UserRolesEnum.SUPER_ADMIN,
      UserRolesEnum.COURSE_ADMIN,
    ]),
    updateCourse,
  )
  .get(getCourseById)
  .delete(
    verifyJWT,
    validateUserPermission([
      UserRolesEnum.SUPER_ADMIN,
      UserRolesEnum.COURSE_ADMIN,
    ]),
    deleteCourse
  );

export default router;
