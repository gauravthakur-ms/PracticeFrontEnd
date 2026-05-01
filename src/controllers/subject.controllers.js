import mongoose from "mongoose";
import { Subject } from "../models/subject.models.js";
import { Course } from "../models/course.models.js";
import { Lesson } from "../models/lesson.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserRolesEnum } from "../utils/constant.js";

const ensureCourseOwnership = (course, user) => {
  if (user.role === UserRolesEnum.SUPER_ADMIN) return;
  if (String(course.createdBy) !== String(user._id)) {
    throw new ApiError(403, "You are not allowed to modify this course");
  }
};

const createSubject = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, order } = req.body;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  ensureCourseOwnership(course, req.user);

  let subjectOrder = order;
  if (subjectOrder === undefined || subjectOrder === null || subjectOrder === "") {
    const last = await Subject.findOne({ course: course._id })
      .sort({ order: -1 })
      .select("order");
    subjectOrder = last ? (last.order || 0) + 1 : 0;
  }

  const subject = await Subject.create({
    title,
    order: subjectOrder,
    course: course._id,
    createdBy: req.user._id,
  });

  await Course.findByIdAndUpdate(courseId, { $addToSet: { subjects: subject._id } });

  return res
    .status(201)
    .json(new ApiResponse(201, subject, "Subject created successfully"));
});

const getSubjects = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const subjects = await Subject.find({ course: courseId })
    .sort({ order: 1 })
    .populate("numberOfLessons");
  return res
    .status(200)
    .json(new ApiResponse(200, subjects, "Subjects fetched"));
});

const getSubjectById = asyncHandler(async (req, res) => {
  const { courseId, subjectId } = req.params;
  const subject = await Subject.findOne({ _id: subjectId, course: courseId })
    .populate("numberOfLessons");
  if (!subject) throw new ApiError(404, "Subject not found");
  return res
    .status(200)
    .json(new ApiResponse(200, subject, "Subject fetched"));
});

const updateSubject = asyncHandler(async (req, res) => {
  const { courseId, subjectId } = req.params;
  const { title, order } = req.body;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  ensureCourseOwnership(course, req.user);

  const subject = await Subject.findOneAndUpdate(
    { _id: subjectId, course: courseId },
    { ...(title && { title }), ...(order !== undefined && { order }) },
    { new: true },
  );
  if (!subject) throw new ApiError(404, "Subject not found");
  return res
    .status(200)
    .json(new ApiResponse(200, subject, "Subject updated"));
});

const deleteSubject = asyncHandler(async (req, res) => {
  const { courseId, subjectId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  ensureCourseOwnership(course, req.user);

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const subject = await Subject.findOneAndDelete(
        { _id: subjectId, course: courseId },
        { session },
      );
      if (!subject) throw new ApiError(404, "Subject not found");
      await Lesson.deleteMany({ subject: subjectId }, { session });
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { subjects: subjectId } },
        { session },
      );
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    // Standalone Mongo (no replica set) cannot do transactions — fall back
    const subject = await Subject.findOneAndDelete({ _id: subjectId, course: courseId });
    if (!subject) throw new ApiError(404, "Subject not found");
    await Lesson.deleteMany({ subject: subjectId });
    await Course.findByIdAndUpdate(courseId, { $pull: { subjects: subjectId } });
  } finally {
    session.endSession();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subject and its lessons deleted"));
});

const updateSubjectOrder = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { items } = req.body; // [{ subjectId, order }, ...]

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  ensureCourseOwnership(course, req.user);

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "items array required");
  }

  const ops = items.map((it) => ({
    updateOne: {
      filter: { _id: it.subjectId, course: courseId },
      update: { order: it.order },
    },
  }));
  await Subject.bulkWrite(ops);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subject order updated"));
});

export {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  updateSubjectOrder,
};
