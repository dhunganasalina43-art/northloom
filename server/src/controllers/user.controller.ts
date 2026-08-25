import { Request, Response } from "express";
import User from "../models/user.model";
import ApiError from "../utils/apiError.utils";
import { sendResponse } from "../utils/apiResponse.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils";
import { getPagination, buildMeta } from "../utils/pagination.utils";

/**
 * PUT /api/v1/users/profile
 * Purpose: update the logged-in user's own profile fields.
 * Auth: required.
 * Body: { full_name?, phone? }
 * Response: 200 with updated user.
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { full_name, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { ...(full_name && { full_name }), ...(phone && { phone }) } },
    { new: true, runValidators: true },
  );

  if (!user) throw new ApiError("User not found", 404);

  sendResponse(res, { message: "Profile updated", data: user, statusCode: 200 });
});

/**
 * PUT /api/v1/users/profile/avatar
 * Purpose: replace the logged-in user's avatar image.
 * Auth: required. Body: multipart/form-data with field "avatar".
 * Response: 200 with updated user.
 */
export const updateAvatar = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) throw new ApiError("avatar image is required", 400);

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError("User not found", 404);

  if (user.avatar?.public_id) {
    await deleteFromCloudinary(user.avatar.public_id);
  }

  const uploaded = await uploadToCloudinary(file.path, "northloom/avatars");
  user.avatar = uploaded;
  await user.save();

  sendResponse(res, { message: "Avatar updated", data: user, statusCode: 200 });
});

/**
 * POST /api/v1/users/addresses
 * Purpose: add a shipping address to the logged-in user's address book.
 * Auth: required.
 * Body: { label, line1, city, state, postal_code, country, is_default? }
 */
export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const { line1, city, state, postal_code, country } = req.body;
  if (!line1 || !city || !state || !postal_code || !country) {
    throw new ApiError("line1, city, state, postal_code and country are required", 400);
  }

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError("User not found", 404);

  if (req.body.is_default) {
    user.addresses.forEach((a) => (a.is_default = false));
  }

  user.addresses.push(req.body);
  await user.save();

  sendResponse(res, { message: "Address added", data: user.addresses, statusCode: 201 });
});

/**
 * GET /api/v1/users  (admin only)
 * Purpose: list all customer accounts for the admin dashboard.
 * Query: page, limit
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { currentPage, pageSize, skip } = getPagination(
    req.query.page as string,
    req.query.limit as string,
  );

  const [users, totalCount] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize),
    User.countDocuments(),
  ]);

  sendResponse(res, {
    message: "Users fetched",
    data: users,
    statusCode: 200,
    meta: buildMeta(totalCount, currentPage, pageSize),
  });
});
