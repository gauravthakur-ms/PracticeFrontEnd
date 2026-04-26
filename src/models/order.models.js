import mongoose, { Schema } from "mongoose";

export const OrderStatusEnum = {
  Pending: "pending",
  Approved: "approved",
  Declined: "declined",
};
export const AvailableOrderStatus = Object.values(OrderStatusEnum);

const orderSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "usd",
    },
    paymentStatus: {
      type: String,
      enum: AvailableOrderStatus,
      default: OrderStatusEnum.Pending,
      index: true,
    },
    orderId: {
      type: String, // internal order id (we use _id by default; keep field for external mapping)
    },
    paymentId: {
      type: String, // Stripe payment intent id
      index: true,
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
