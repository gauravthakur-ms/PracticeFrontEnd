import mongoose, { Schema } from "mongoose";
import {
  AvailableAdminRolesEnum,
  AvailableAdminRolesRequestStatusEnum,
} from "../utils/constant.js";

const adminRequestSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedRole: {
      type: String,
      enum: AvailableAdminRolesEnum,
    },
    status: {
      type: String,
      enum: AvailableAdminRolesRequestStatusEnum,
      default: "pending",
    },
  },
  { timestamps: true },
);

export const AdminRequest = mongoose.model("AdminRequest",adminRequestSchema);