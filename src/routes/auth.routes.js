import express from "express";
import passport from "../utils/passport.js";
import {
  changeUserPassword,
  deleteCurrentUser,
  getCurrentUser,
  googleLoginSuccess,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  requestPasswordReset,
  resendEmailVerification,
  resetPassword,
  updateCurrentUser,
  verifyEmail,
  postAdminRequest,
  fetchAdminRequest,
  updateAdminRequest,
  deleteAdminRequest,
} from "../controllers/auth.controllers.js";
import {
  adminRequestValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  passwordResetValidator,
  userRegisteredValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  validateUserPermission,
  verifyJWT,
} from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../utils/constant.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleLoginSuccess,
);

router
  .route("/register")
  .post(userRegisteredValidator(), validate, registerUser);

router.route("/login").post(userRegisteredValidator(), validate, loginUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router
  .route("/forgot-password")
  .post(forgotPasswordValidator(), validate, requestPasswordReset);

router
  .route("/reset-password/:resetToken")
  .post(passwordResetValidator(), validate, resetPassword);

router.route("/refresh-token").post(refreshAccessToken);

//secured
router.route("/logout").post(verifyJWT, logoutUser);
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

router.route("/current-user").get(verifyJWT, getCurrentUser);
router
  .route("/current-user/:userId")
  .put(verifyJWT, updateCurrentUser)
  .delete(verifyJWT, deleteCurrentUser);

router
  .route("/change-password")
  .post(changePasswordValidator(), validate, verifyJWT, changeUserPassword);

router
  .route("/admin-request")
  .post(adminRequestValidator(), validate, verifyJWT, postAdminRequest)
  .get(
    verifyJWT,
    validateUserPermission([UserRolesEnum.SUPER_ADMIN]),
    fetchAdminRequest,
  );

router
  .route("/admin-request/:adminRequestId")
  .put(
    verifyJWT,
    validateUserPermission([UserRolesEnum.SUPER_ADMIN]),
    updateAdminRequest,
  )
  .delete(
    verifyJWT,
    validateUserPermission([UserRolesEnum.SUPER_ADMIN]),
    deleteAdminRequest,
  );
export default router;
