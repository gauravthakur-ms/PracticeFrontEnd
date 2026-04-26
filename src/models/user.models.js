import mongoose, { Schema } from "mongoose";
import {
  AvailableUserCourseStatus,
  AvailableUserRoles,
} from "../utils/constant.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Crypto from "crypto";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.oauthProvider;
      },
      minlength: 6,
    },
    oauthProvider: {
      type: String,
      enum: ["google", "apple", null],
      default: null,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    purchasedCourses: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        purchaseDate: {
          type: Date,
          default: Date.now,
        },
        validTill: {
          type: Date,
          default: null,
        },
        status: {
          type: String,
          enum: AvailableUserCourseStatus,
          default: "active",
        },
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.pre("validate", function () {
  if (!this.userName && this.email) {
    this.userName =
      this.email.split("@")[0] + Math.floor(Math.random() * 10000);
  }
});

userSchema.methods.comparePassword = async function (Password) {
  return await bcrypt.compare(Password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateTemporaryToken = function () {
    const unHashedToken = Crypto.randomBytes(20).toString("hex");
    const hashedToken = Crypto.createHash("sha256").update(unHashedToken).digest("hex");
    const tokenExpiry = Date.now() + 20*60*1000;
    return { unHashedToken, hashedToken, tokenExpiry };
}


export const User = mongoose.model("User", userSchema);
