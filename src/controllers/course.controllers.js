import { Course } from "../models/course.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/api-response.js";

//create course
const createCourse = asyncHandler(async (req, res) => {
  const { title, label, description, totalPrice, discountPercent } = req.body;

  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const payableAmount = Course.calculatePayableAmount({
    totalPrice,
    discountPercent,
  });

  const course = await Course.create({
    title,
    label,
    description,
    totalPrice,
    discountPercent,
    payableAmount,
    thumbnail: attachments,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});

const getAllCourse = asyncHandler(async (req, res) => {
  const course = await Course.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $unwind: "$createdBy",
    },
    {
      $project: {
        title: 1,
        description: 1,
        label: 1,
        totalPrice: 1,
        discountPercent: 1,
        payableAmount: 1,
        averageRating: 1,
        thumbnail: 1,
        "createdBy.userName": 1,
        "createdBy.email": 1,
        "createdBy.fullName": 1,
        "createdBy.role": 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (!course.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No courses available yet"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course, "course is fetched"));
});

const getCourseById = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $unwind: "$createdBy",
    },
    {
      $project: {
        title: 1,
        description: 1,
        label: 1,
        totalPrice: 1,
        discountPercent: 1,
        payableAmount: 1,
        averageRating: 1,
        thumbnail: 1,
        "createdBy.userName": 1,
        "createdBy.email": 1,
        "createdBy.fullName": 1,
        "createdBy.role": 1,
      },
    },
  ]);

  if (!course.length) {
    throw new ApiError(404, "Course not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course, "course fetched successfully"));
});

const updateCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const { title, label, description, totalPrice, discountPercent } = req.body;

  const files = req.files || [];
  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });
  const payableAmount = Course.calculatePayableAmount({
    totalPrice,
    discountPercent,
  });

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      title,
      label,
      description,
      totalPrice,
      discountPercent,
      payableAmount,
      ...(files.length && { thumbnail: attachments }),
    },
    { new: true },
  );
  if (!updatedCourse) {
    throw new ApiError(404, "Course not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCourse, "Course updated successfully"));
});

const deleteCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findByIdAndDelete(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "course deleted successfully"));
});

export {
  createCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
};
