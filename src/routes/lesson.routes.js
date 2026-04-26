import express from "express";
import {
  verifyJWT,
  validateUserPermission,
  requireActivePurchase,
} from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../utils/constant.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  createLessonValidator,
  updateLessonValidator,
  reorderItemsValidator,
} from "../validators/index.js";
import {
  createLesson,
  getLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
  updateLessonOrder,
} from "../controllers/lesson.controllers.js";

const router = express.Router({ mergeParams: true });
router.use(verifyJWT);

const adminOnly = validateUserPermission([
  UserRolesEnum.SUPER_ADMIN,
  UserRolesEnum.COURSE_ADMIN,
]);

router
  .route("/")
  .post(adminOnly, createLessonValidator(), validate, createLesson)
  .get(requireActivePurchase, getLessons);

router
  .route("/reorder")
  .put(adminOnly, reorderItemsValidator("lessonId"), validate, updateLessonOrder);

router
  .route("/:lessonId")
  .get(requireActivePurchase, getLessonById)
  .put(adminOnly, updateLessonValidator(), validate, updateLesson)
  .delete(adminOnly, deleteLesson);

export default router;
