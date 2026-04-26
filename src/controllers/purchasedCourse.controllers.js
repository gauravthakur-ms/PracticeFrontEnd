import mongoose from "mongoose";
import { PurchasedCourse } from "../models/purchasedCourse.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { AvailableUserCourseStatus } from "../utils/constant.js";

const getAllPurchasedCourse = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const myCourse = await PurchasedCourse.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: {
        path: "$course",
      },
    },
    {
      $project: {
        _id: 1,
        purchasedDate: 1,
        validTillDate: 1,
        status: 1,
        "course._id": 1,
        "course.title": 1,
        "course.thumbnail": 1,
        "course.label": 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);
  if (!myCourse.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No purchased courses yet"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, myCourse, "Purchased course fetched successfully"),
    );
});

const getPurchasedCoursesOfUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const course = await PurchasedCourse.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: {
        path: "$course",
      },
    },
    {
      $project: {
        purchasedDate: 1,
        validTillDate: 1,
        status: 1,
        "course.title": 1,
        "course.label": 1,
        "course.description": 1,
        "course.thumbnail": 1,
      },
    },
  ]);

  if (!course.length) {
    throw new ApiError(404, "User have not purchased any course till now");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        course,
        "Purchased course of a user fetched successfully",
      ),
    );
});

const updatePurchasedCourseStatus = asyncHandler(async (req, res) => {
  const { status, validity } = req.body;
  const { userId, courseId } = req.params;

  if (!AvailableUserCourseStatus.includes(status)) {
    throw new ApiError(400, `${status} is not available`);
  }

  const updatedCourseStatus = await PurchasedCourse.findOneAndUpdate(
    {
      user: new mongoose.Types.ObjectId(userId),
      course: new mongoose.Types.ObjectId(courseId),
    },
    {
      $set: {
        status: status,
        validTillDate: validity,
      },
    },
    {
      new: true,
    },
  );

  if (!updatedCourseStatus) {
    throw new ApiError(404, "Course not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCourseStatus,
        "Purchased course of a user updated successfully",
      ),
    );
});

const mostlyPurchasedCourse = asyncHandler(async (req, res) => {
  const course = await PurchasedCourse.aggregate([
    {
      $group: {
        _id: "$course",
        totalPurchase: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        $totalPurchase: 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        course,
        "Mostly purchased course fetched successfully",
      ),
    );
});

export {
  getAllPurchasedCourse,
  getPurchasedCoursesOfUser,
  updatePurchasedCourseStatus,
  mostlyPurchasedCourse
};
