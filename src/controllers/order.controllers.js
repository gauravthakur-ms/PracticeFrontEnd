import Stripe from "stripe";
import express from "express";
import { Order, OrderStatusEnum } from "../models/order.models.js";
import { Course } from "../models/course.models.js";
import { PurchasedCourse } from "../models/purchasedCourse.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserCourseStatusEnum } from "../utils/constant.js";

let stripeClient = null;
const getStripe = () => {
  if (stripeClient) return stripeClient;
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new ApiError(500, "Stripe is not configured");
  }
  stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeClient;
};

const createOrder = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  // Prevent duplicate active purchase
  const existing = await PurchasedCourse.findOne({
    user: req.user._id,
    course: course._id,
    status: UserCourseStatusEnum.Active,
  });
  if (existing) throw new ApiError(409, "You already own this course");

  const stripe = getStripe();
  const amount = Math.round(course.payableAmount * 100); // smallest unit
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata: {
      courseId: String(course._id),
      userId: String(req.user._id),
    },
    automatic_payment_methods: { enabled: true },
  });

  const order = await Order.create({
    createdBy: req.user._id,
    course: course._id,
    amount: course.payableAmount,
    paymentId: paymentIntent.id,
    paymentStatus: OrderStatusEnum.Pending,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      { orderId: order._id, clientSecret: paymentIntent.client_secret },
      "Payment intent created",
    ),
  );
});

// Stripe webhook — request body MUST be raw
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(500).send("Webhook secret not configured");
  }
  let event;
  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const order = await Order.findOneAndUpdate(
        { paymentId: pi.id },
        { paymentStatus: OrderStatusEnum.Approved },
        { new: true },
      );
      if (order) {
        const validityDays = parseInt(process.env.DEFAULT_COURSE_VALIDITY_DAYS || "365", 10);
        const validTillDate = new Date(Date.now() + validityDays * 86400000);
        await PurchasedCourse.findOneAndUpdate(
          { user: order.createdBy, course: order.course },
          {
            user: order.createdBy,
            course: order.course,
            purchasedDate: new Date(),
            validTillDate,
            status: UserCourseStatusEnum.Active,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
        // Also embed in user.purchasedCourses for fast lookup
        await User.findByIdAndUpdate(order.createdBy, {
          $addToSet: {
            purchasedCourses: {
              courseId: order.course,
              purchaseDate: new Date(),
              validTill: validTillDate,
              status: "active",
            },
          },
        });
      }
    } else if (
      event.type === "payment_intent.payment_failed" ||
      event.type === "payment_intent.canceled"
    ) {
      const pi = event.data.object;
      await Order.findOneAndUpdate(
        { paymentId: pi.id },
        { paymentStatus: OrderStatusEnum.Declined },
      );
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).send("Webhook handler failed");
  }
  return res.json({ received: true });
};

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("createdBy", "userName email")
    .populate("course", "title label payableAmount")
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, orders, "Orders fetched"));
});

const getRecentOrders = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "10", 10), 100);
  const orders = await Order.find()
    .populate("createdBy", "userName email")
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .limit(limit);
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Recent orders fetched"));
});

const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const orders = await Order.find({ createdBy: userId })
    .populate("course", "title label")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "User orders fetched"));
});

export {
  createOrder,
  stripeWebhook,
  getOrders,
  getRecentOrders,
  getUserOrders,
};
