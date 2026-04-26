import mongoose, { Schema } from "mongoose";

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // milliseconds
      default: 0,
    },
  },
  { timestamps: true },
);

lessonSchema.index({ subject: 1, order: 1 });

export const Lesson = mongoose.model("Lesson", lessonSchema);
