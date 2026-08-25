import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError.utils";

/**
 * Single place where every thrown/forwarded error in the app is turned
 * into a JSON response. Recognises ApiError (expected failures),
 * Mongoose ValidationError, Mongoose duplicate-key errors, and falls
 * back to a generic 500 for anything unexpected.
 */
export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = error?.statusCode || 500;
  let status = error?.status || "error";
  let message = error?.message || "Internal server error";

  if (error.name === "ValidationError") {
    statusCode = 422;
    status = "fail";
    message = Object.values(error.errors)
      .map((e: any) => e.message)
      .join(", ");
  }

  if (error.code === 11000) {
    statusCode = 409;
    status = "fail";
    const field = Object.keys(error.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  }

  if (error.name === "CastError") {
    statusCode = 400;
    status = "fail";
    message = `Invalid ${error.path}: ${error.value}`;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    status,
    message,
    data: null,
  });
};
