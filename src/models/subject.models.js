import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema(
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

subjectSchema.index({ course: 1, order: 1 });

// virtual: numberOfLessons
subjectSchema.virtual("numberOfLessons", {
  ref: "Lesson",
  localField: "_id",
  foreignField: "subject",
  count: true,
});

export const Subject = mongoose.model("Subject", subjectSchema);
