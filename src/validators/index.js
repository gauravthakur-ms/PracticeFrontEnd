import { body, param } from "express-validator";
import {
  AvailableAdminRolesEnum,
  AvailableUserCourseStatus,
} from "../utils/constant.js";
import { AvailableReviewStatus } from "../models/review.models.js";

const userRegisteredValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

const changePasswordValidator = () => {
  return [
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Old Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

const forgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),
  ];
};

const passwordResetValidator = () => {
  return [
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    param("resetToken")
      .trim()
      .notEmpty()
      .withMessage("Reset token is required"),
  ];
};

const adminRequestValidator = () => {
  return [
    body("role")
      .trim()
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableAdminRolesEnum)
      .withMessage("You can select only from the given admin roles"),
  ];
};

const createCourseValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Course Title is required"),

    body("label").trim().notEmpty().withMessage("Course Label is required"),
    body("totalPrice")
      .notEmpty()
      .withMessage("Course -> Total price is required")
      .isInt()
      .withMessage("Total price must be integer"),
  ];
};

const updatePurchasedCourseStatusValidator = () => {
  return [
    body("status")
      .trim()
      .isIn(AvailableUserCourseStatus)
      .withMessage("Wrong status"),

    body("validity")
      .isDate()
      .withMessage("validity should be date"),

    param("userId")
      .isMongoId()
      .withMessage("Invalid user id"),

    param("courseId")
      .isMongoId()
      .withMessage("Invalid course id"),
  ];
};

const createSubjectValidator = () => [
  body("title").trim().notEmpty().withMessage("title is required"),
  body("order").optional().isInt({ min: 0 }).withMessage("order must be a non-negative integer"),
];

const updateSubjectValidator = () => [
  body("title").optional().trim().notEmpty(),
  body("order").optional().isInt({ min: 0 }),
];

const createLessonValidator = () => [
  body("title").trim().notEmpty().withMessage("title is required"),
  body("order").optional().isInt({ min: 0 }).withMessage("order must be a non-negative integer"),
  body("videoUrl").trim().notEmpty().withMessage("videoUrl is required").isURL().withMessage("videoUrl must be a URL"),
  body("duration").optional().isInt({ min: 0 }).withMessage("duration must be a positive integer (ms)"),
];

const updateLessonValidator = () => [
  body("title").optional().trim().notEmpty(),
  body("order").optional().isInt({ min: 0 }),
  body("videoUrl").optional().isURL(),
  body("duration").optional().isInt({ min: 0 }),
];

const reorderItemsValidator = (idField) => [
  body("items").isArray({ min: 1 }).withMessage("items must be a non-empty array"),
  body(`items.*.${idField}`).isMongoId().withMessage(`${idField} must be a valid id`),
  body("items.*.order").isInt({ min: 0 }).withMessage("order must be a non-negative integer"),
];

const createReviewValidator = () => [
  body("rating").isInt({ min: 1, max: 10 }).withMessage("rating must be 1-10"),
  body("review").optional().isString(),
];

const updateReviewStatusValidator = () => [
  body("status").isIn(AvailableReviewStatus).withMessage("invalid review status"),
];

export {
  userRegisteredValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  passwordResetValidator,
  adminRequestValidator,
  createCourseValidator,
  updatePurchasedCourseStatusValidator,
  createSubjectValidator,
  updateSubjectValidator,
  createLessonValidator,
  updateLessonValidator,
  reorderItemsValidator,
  createReviewValidator,
  updateReviewStatusValidator,
};
