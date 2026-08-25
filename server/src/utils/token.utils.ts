import jwt from "jsonwebtoken";
import ENV_CONFIG from "../config/env.config";
import { Role } from "../types/enum.types";

export type TJwtPayload = {
  _id: string;
  full_name: string;
  email: string;
  role: Role;
};

export type TDecodedToken = TJwtPayload & { iat: number; exp: number };

/** Signs a JWT access token containing the minimal user identity needed for auth checks. */
export const signToken = (payload: TJwtPayload): string => {
  return jwt.sign(payload, ENV_CONFIG.jwtSecret, {
    expiresIn: ENV_CONFIG.jwtExpiry as any,
  });
};

/** Verifies and decodes a JWT access token. Throws if invalid or expired. */
export const verifyToken = (token: string): TDecodedToken => {
  return jwt.verify(token, ENV_CONFIG.jwtSecret) as TDecodedToken;
};
