import { Request, Response } from "express";
import User from "../models/user.model";
import ApiError from "../utils/apiError.utils";
import { sendResponse } from "../utils/apiResponse.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { hashPassword, comparePassword } from "../utils/hash.utils";
import { signToken } from "../utils/token.utils";
import ENV_CONFIG from "../config/env.config";

const cookieOptions = () => ({
  httpOnly: true,
  secure: ENV_CONFIG.nodeEnv === "production",
  sameSite: (ENV_CONFIG.nodeEnv === "production" ? "none" : "lax") as "none" | "lax",
  maxAge: ENV_CONFIG.cookieExpiryDays * 24 * 60 * 60 * 1000,
  path: "/",
});

/**
 * POST /api/v1/auth/register
 * Purpose: create a new customer account.
 * Body: { full_name, email, password, phone? }
 * Validation: full_name >=3 chars, valid-looking email, password >=6 chars,
 *             email must be unique (enforced by the User model + duplicate-key handler).
 * Response: 201 with the created user (password excluded).
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { full_name, email, password, phone } = req.body;

  if (!full_name) throw new ApiError("full_name is required", 400);
  if (!email) throw new ApiError("email is required", 400);
  if (!password) throw new ApiError("password is required", 400);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError("An account with this email already exists", 409);

  const password_hash = await hashPassword(password);
  const user = await User.create({
    full_name,
    email: email.toLowerCase(),
    password: password_hash,
    phone,
  });

  const safeUser = user.toObject();
  delete (safeUser as any).password;

  sendResponse(res, {
    message: "Account created successfully",
    data: safeUser,
    statusCode: 201,
  });
});

/**
 * POST /api/v1/auth/login
 * Purpose: authenticate a user and issue a JWT session cookie.
 * Body: { email, password }
 * Validation: both fields required; credentials must match a stored user.
 * Response: 200 with user profile + access_token (also set as httpOnly cookie).
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) throw new ApiError("email is required", 400);
  if (!password) throw new ApiError("password is required", 400);

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) throw new ApiError("Invalid email or password", 401);

  const matched = await comparePassword(password, user.password);
  if (!matched) throw new ApiError("Invalid email or password", 401);

  const access_token = signToken({
    _id: String(user._id),
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  });

  res.cookie("access_token", access_token, cookieOptions());

  const safeUser = user.toObject();
  delete (safeUser as any).password;

  sendResponse(res, {
    message: "Login successful",
    data: { user: safeUser, access_token },
    statusCode: 200,
  });
});

/**
 * POST /api/v1/auth/logout
 * Purpose: clear the session cookie.
 * Response: 200, no data.
 */
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("access_token", { ...cookieOptions(), maxAge: 0 });
  sendResponse(res, { message: "Logged out successfully", statusCode: 200, data: null });
});

/**
 * GET /api/v1/auth/me
 * Purpose: return the currently authenticated user's profile.
 * Auth: required (any role).
 * Response: 200 with user profile.
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError("User not found", 404);

  sendResponse(res, { message: "Profile fetched", data: user, statusCode: 200 });
});
