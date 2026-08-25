import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError.utils";

/** Catches any request that didn't match a registered route. */
export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(`Cannot ${req.method} ${req.originalUrl}`, 404));
};
