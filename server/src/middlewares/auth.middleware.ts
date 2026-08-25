import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError.utils";
import { verifyToken } from "../utils/token.utils";
import { Role } from "../types/enum.types";

/**
 * Returns an Express middleware that:
 *  1. Reads the JWT from the httpOnly "access_token" cookie
 *  2. Verifies it and attaches the decoded identity to req.user
 *  3. If `roles` is provided, rejects the request unless the user's
 *     role is in that list (role-based authorization)
 *
 * Usage: router.post('/', authenticate([Role.ADMIN]), createProduct)
 */
export const authenticate = (roles?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.access_token;

      if (!token) {
        throw new ApiError("Unauthorized. Please log in.", 401);
      }

      const decoded = verifyToken(token);

      if (roles && !roles.includes(decoded.role)) {
        throw new ApiError("Forbidden. You do not have access to this resource.", 403);
      }

      req.user = {
        _id: decoded._id,
        email: decoded.email,
        full_name: decoded.full_name,
        role: decoded.role,
      };

      next();
    } catch (error) {
      next(new ApiError("Unauthorized. Invalid or expired session.", 401));
    }
  };
};
