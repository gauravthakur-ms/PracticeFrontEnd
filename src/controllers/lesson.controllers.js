import { Lesson } from "../models/lesson.models.js";
import { Subject } from "../models/subject.models.js";
import { Course } from "../models/course.models.js";
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

const loadCourseAndSubject = async (courseId, subjectId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  const subject = await Subject.findOne({ _id: subjectId, course: courseId });
  if (!subject) throw new ApiError(404, "Subject not found");
  return { course, subject };
};

const createLesson = asyncHandler(async (req, res) => {
  const { courseId, subjectId } = req.params;
  const { title, order, videoUrl, duration } = req.body;

  const { course } = await loadCourseAndSubject(courseId, subjectId);
  ensureCourseOwnership(course, req.user);

  let lessonOrder = order;
  if (lessonOrder === undefined || lessonOrder === null || lessonOrder === "") {
    const last = await Lesson.findOne({ subject: subjectId })
      .sort({ order: -1 })
      .select("order");
    lessonOrder = last ? (last.order || 0) + 1 : 0;
  }

  const lesson = await Lesson.create({
    title,
    order: lessonOrder,
    videoUrl,
    duration: duration || 0,
    subject: subjectId,
    course: courseId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, lesson, "Lesson created"));
});

const getLessons = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const lessons = await Lesson.find({ subject: subjectId }).sort({ order: 1 });
  return res.status(200).json(new ApiResponse(200, lessons, "Lessons fetched"));
});

const getLessonById = asyncHandler(async (req, res) => {
  const { subjectId, lessonId } = req.params;
  const lesson = await Lesson.findOne({ _id: lessonId, subject: subjectId });
  if (!lesson) throw new ApiError(404, "Lesson not found");
  return res.status(200).json(new ApiResponse(200, lesson, "Lesson fetched"));
});

const updateLesson = asyncHandler(async (req, res) => {
  const { courseId, subjectId, lessonId } = req.params;
  const { title, order, videoUrl, duration } = req.body;

  const { course } = await loadCourseAndSubject(courseId, subjectId);
  ensureCourseOwnership(course, req.user);

  const lesson = await Lesson.findOneAndUpdate(
    { _id: lessonId, subject: subjectId },
    {
      ...(title && { title }),
      ...(order !== undefined && { order }),
      ...(videoUrl && { videoUrl }),
      ...(duration !== undefined && { duration }),
    },
    { new: true },
  );
  if (!lesson) throw new ApiError(404, "Lesson not found");
  return res.status(200).json(new ApiResponse(200, lesson, "Lesson updated"));
});

const deleteLesson = asyncHandler(async (req, res) => {
  const { courseId, subjectId, lessonId } = req.params;
  const { course } = await loadCourseAndSubject(courseId, subjectId);
  ensureCourseOwnership(course, req.user);

  const lesson = await Lesson.findOneAndDelete({ _id: lessonId, subject: subjectId });
  if (!lesson) throw new ApiError(404, "Lesson not found");
  return res.status(200).json(new ApiResponse(200, {}, "Lesson deleted"));
});

const updateLessonOrder = asyncHandler(async (req, res) => {
  const { courseId, subjectId } = req.params;
  const { items } = req.body;

  const { course } = await loadCourseAndSubject(courseId, subjectId);
  ensureCourseOwnership(course, req.user);

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "items array required");
  }
  const ops = items.map((it) => ({
    updateOne: {
      filter: { _id: it.lessonId, subject: subjectId },
      update: { order: it.order },
    },
  }));
  await Lesson.bulkWrite(ops);
  return res.status(200).json(new ApiResponse(200, {}, "Lesson order updated"));
});

export {
  createLesson,
  getLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
  updateLessonOrder,
};
