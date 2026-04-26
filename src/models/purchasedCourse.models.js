import mongoose, { Schema } from "mongoose";
import {
  AvailableUserCourseStatus,
  UserCourseStatusEnum,
} from "../utils/constant.js";

const PurchasedCourseSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purchasedDate: {
      type: Date,
      default: Date.now(),
    },
    validTillDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: AvailableUserCourseStatus,
      default: UserCourseStatusEnum.Active,
    },
  },
  { timestamps: true },
);

export const PurchasedCourse = mongoose.model(
  "PurchasedCourse",
  PurchasedCourseSchema,
);
