import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Wraps an async Express route handler so any thrown error (or rejected
 * promise) is forwarded to next(), instead of needing a try/catch block
 * in every single controller function.
 */
export const asyncHandler = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
