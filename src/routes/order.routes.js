import express from "express";
import {
  verifyJWT,
  validateUserPermission,
} from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../utils/constant.js";
import {
  createOrder,
  stripeWebhook,
  getOrders,
  getRecentOrders,
  getUserOrders,
} from "../controllers/order.controllers.js";

// Main router (mounted at /api/v1/courses/:courseId/orders)
const router = express.Router({ mergeParams: true });
router.use(verifyJWT);

const adminOnly = validateUserPermission([
  UserRolesEnum.SUPER_ADMIN,
  UserRolesEnum.COURSE_ADMIN,
]);

router.post("/", createOrder);
router.get("/", adminOnly, getOrders);
router.get("/recent-orders", adminOnly, getRecentOrders);
router.get("/users/:userId", adminOnly, getUserOrders);

export default router;

// Separate router for Stripe webhook — uses raw body
export const stripeWebhookRouter = express.Router();
stripeWebhookRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);
