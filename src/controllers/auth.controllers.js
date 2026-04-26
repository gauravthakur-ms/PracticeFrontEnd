import { User } from "../models/user.models.js";
import { AdminRequest } from "../models/adminRequest.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { sendMail } from "../utils/send-mail.js";
import { forgotPasswordMail, verificationMail } from "../services/email.js";
import Crypto from "crypto";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import {
  AvailableAdminRolesEnum,
  AvailableAdminRolesRequestStatusEnum,
} from "../utils/constant.js";

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens", []);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }
  const user = await User.create({ email, password });
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });
  // send verification email
  await sendMail({
    email: user.email,
    subject: "Verify your email for Sanatan International",
    html: verificationMail(
      user.userName,
      `${process.env.FRONTEND_URL}/api/v1/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await User.findOne({ email }).select(
    "-password -refreshToken -emailVerificationExpiry -emailVerificationToken -forgotPasswordExpiry -forgotPasswordToken",
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id,
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationExpiry -emailVerificationToken -forgotPasswordExpiry -forgotPasswordToken",
  );
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          "Access Token": accessToken,
          "Refresh Token": refreshToken,
        },
        "Login successful",
      ),
    );
});

const googleLoginSuccess = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Google authentication failed");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id,
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationExpiry -emailVerificationToken -forgotPasswordExpiry -forgotPasswordToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Google login successful",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;
  if (!verificationToken) {
    throw new ApiError(400, "Verification token is required");
  }
  const hashedToken = Crypto.createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(401, "Invalid verification token");
  }
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.isEmailVerified) {
    throw new ApiError(400, "Email already verified");
  }
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });
  await sendMail({
    email: user.email,
    subject: "Sanatan International - Email Verification Mail",
    mail: verificationMail(
      user.userName,
      `${process.env.FRONTEND_URL}/api/v1/verify-email/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verification mail sent"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -oauthProvider -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken",
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user: user }, "User fetched successfully"));
});

const updateCurrentUser = asyncHandler(async (req, res) => {
  const { username, fullname } = req.body;

  if (!username || !fullname) {
    throw new ApiError(400, "At least one field is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        userName: username,
        fullName: fullname,
      },
    },
    { new: true, runValidators: true },
  ).select(
    "-password -oauthProvider -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken",
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedUser: user },
        "Profile updated successfully",
      ),
    );
});

const deleteCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Profile deleted successfully"));
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Password");
  }
  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordTokenExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  await sendMail({
    to: email,
    subject: "Reset your password",
    html: forgotPasswordMail(
      user.userName,
      `${process.env.FRONTEND_URL}/api/v1/reset-password/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Forgot password mail has been sent"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  if (!resetToken) {
    throw new ApiError(400, "Reset token is required");
  }

  const hashedToken = Crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordTokenExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(401, "Invalid forgot password token");
  }
  user.password = password;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(404, "Refresh token not found");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (incomingRefreshToken != user.refreshToken) {
      throw new ApiError(401, "Refresh Token Expired");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
      user._id,
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
          "Access token refreshed successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(401, "unauthorized access");
  }
});

const postAdminRequest = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!AvailableAdminRolesEnum.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const existingRequest = await AdminRequest.findOne({
    user: req.user._id,
    status: "pending",
  });

  if (existingRequest) {
    throw new ApiError(400, "You already have a pending request");
  }

  const adminRequest = await AdminRequest.create({
    user: req.user._id,
    requestedRole: role,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { username: req.user.userName, email: req.user.email, adminRequest },
        "Your request is posted successfully",
      ),
    );
});

const fetchAdminRequest = asyncHandler(async (req, res) => {
  if (req.user?.role != "super_admin") {
    throw new ApiError(400, "Admin request is fetched only by super admin");
  }
  const adminRequest = await AdminRequest.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(
      new ApiResponse(200, adminRequest, "Admin request fetched successfully"),
    );
});

const updateAdminRequest = asyncHandler(async (req, res) => {
  const adminRequestId = req.params.adminRequestId;
  const { status } = req.body;
  if (!AvailableAdminRolesRequestStatusEnum.includes(status)) {
    throw new ApiError(400, `${status} is not allowed`);
  }
  const updatedRequest = await AdminRequest.findByIdAndUpdate(
    adminRequestId,
    {
      $set: {
        status: status,
      },
    },
    {
      new: true,
    },
  );
  if (!updatedRequest) {
    throw new ApiError(404, "Admin request not found");
  }
  if (status == "accepted") {
    const updatedUser = await User.findByIdAndUpdate(
      updatedRequest.user,
      {
        $set: {
          role: updatedRequest.requestedRole,
        },
      },
      {
        new: true,
      },
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `role is updated to ${updatedRequest.requestedRole}`,
      ),
    );
});

const deleteAdminRequest = asyncHandler(async (req, res) => {
  const { adminRequestId } = req.params;
  const adminRequest = await AdminRequest.findByIdAndDelete(adminRequestId);
  if (!adminRequest) {
    throw new ApiError(404, `Admin not found`);
  }
  const updatedUser = await User.findByIdAndUpdate(
    adminRequest.user,
    {
      $set: {
        role: "user",
      },
    },
    {
      new: true,
    },
  );
  return res
    .status(200)
    .json(new ApiResponse(200, {}, `${adminRequest.requestedRole} is removed`));
});

export {
  registerUser,
  googleLoginSuccess,
  loginUser,
  logoutUser,
  verifyEmail,
  resendEmailVerification,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  changeUserPassword,
  requestPasswordReset,
  resetPassword,
  refreshAccessToken,
  postAdminRequest,
  fetchAdminRequest,
  updateAdminRequest,
  deleteAdminRequest,
};
