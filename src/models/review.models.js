import mongoose, { Schema } from "mongoose";

export const ReviewStatusEnum = {
  Pending: "pending",
  Approved: "approved",
  Declined: "declined",
};
export const AvailableReviewStatus = Object.values(ReviewStatusEnum);

const reviewSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    review: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: AvailableReviewStatus,
      default: ReviewStatusEnum.Pending,
      index: true,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ createdBy: 1, course: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
