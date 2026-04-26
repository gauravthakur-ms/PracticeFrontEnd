import express from "express";
import {
  verifyJWT,
  validateUserPermission,
  requireActivePurchase,
} from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../utils/constant.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  createSubjectValidator,
  updateSubjectValidator,
  reorderItemsValidator,
} from "../validators/index.js";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  updateSubjectOrder,
} from "../controllers/subject.controllers.js";

const router = express.Router({ mergeParams: true });
router.use(verifyJWT);

const adminOnly = validateUserPermission([
  UserRolesEnum.SUPER_ADMIN,
  UserRolesEnum.COURSE_ADMIN,
]);

router
  .route("/")
  .post(adminOnly, createSubjectValidator(), validate, createSubject)
  .get(requireActivePurchase, getSubjects);

router
  .route("/reorder")
  .put(adminOnly, reorderItemsValidator("subjectId"), validate, updateSubjectOrder);

router
  .route("/:subjectId")
  .get(requireActivePurchase, getSubjectById)
  .put(adminOnly, updateSubjectValidator(), validate, updateSubject)
  .delete(adminOnly, deleteSubject);

export default router;
