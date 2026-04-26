import { Review, ReviewStatusEnum, AvailableReviewStatus } from "../models/review.models.js";
import { Course } from "../models/course.models.js";
import { PurchasedCourse } from "../models/purchasedCourse.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserRolesEnum, UserCourseStatusEnum } from "../utils/constant.js";

const recomputeCourseAggregates = async (courseId) => {
  const stats = await Review.aggregate([
    { $match: { course: courseId, status: ReviewStatusEnum.Approved } },
    {
      $group: {
        _id: "$course",
        totalReviews: { $sum: 1 },
        totalRatings: { $sum: "$rating" },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  const s = stats[0] || { totalReviews: 0, totalRatings: 0, averageRating: 0 };
  await Course.findByIdAndUpdate(courseId, {
    totalReviews: s.totalReviews,
    totalRatings: s.totalRatings,
    averageRating: s.averageRating || 0,
  });
};

const createReview = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { rating, review } = req.body;

  const purchase = await PurchasedCourse.findOne({
    user: req.user._id,
    course: courseId,
    status: UserCourseStatusEnum.Active,
  });
  if (!purchase) {
    throw new ApiError(403, "You must have purchased this course to review it");
  }

  try {
    const created = await Review.create({
      createdBy: req.user._id,
      course: courseId,
      rating,
      review,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, created, "Review submitted, awaiting approval"));
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, "You have already reviewed this course");
    }
    throw err;
  }
});

// Public/admin: list reviews for a single course
const getCourseReviews = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { status } = req.query;

  const isAdmin = req.user && [UserRolesEnum.SUPER_ADMIN, UserRolesEnum.COURSE_ADMIN].includes(req.user.role);
  let filter = { course: courseId };
  if (status) {
    if (!AvailableReviewStatus.includes(status)) {
      throw new ApiError(400, "Invalid status filter");
    }
    if (status !== ReviewStatusEnum.Approved && !isAdmin) {
      throw new ApiError(403, "Only admins can view non-approved reviews");
    }
    filter.status = status;
  } else if (!isAdmin) {
    filter.status = ReviewStatusEnum.Approved;
  }

  const reviews = await Review.find(filter)
    .populate("createdBy", "userName fullName email")
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched"));
});

// Admin: list reviews across all courses (used at /api/v1/reviews)
const getAllReviews = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) {
    if (!AvailableReviewStatus.includes(status)) {
      throw new ApiError(400, "Invalid status filter");
    }
    filter.status = status;
  }
  const reviews = await Review.find(filter)
    .populate("createdBy", "userName email")
    .populate("course", "title label")
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched"));
});

const updateReviewStatus = asyncHandler(async (req, res) => {
  const { courseId, reviewId } = req.params;
  const { status } = req.body;

  if (!AvailableReviewStatus.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const review = await Review.findOneAndUpdate(
    { _id: reviewId, course: courseId },
    { status },
    { new: true },
  );
  if (!review) throw new ApiError(404, "Review not found");

  await recomputeCourseAggregates(review.course);

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review status updated"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { courseId, reviewId } = req.params;
  const review = await Review.findOneAndDelete({ _id: reviewId, course: courseId });
  if (!review) throw new ApiError(404, "Review not found");
  await recomputeCourseAggregates(review.course);
  return res.status(200).json(new ApiResponse(200, {}, "Review deleted"));
});

export {
  createReview,
  getCourseReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};
