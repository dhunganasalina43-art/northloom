import { Role } from "./enum.types";

/**
 * Augments Express's Request type so `req.user` is type-safe after the
 * `authenticate` middleware runs. Populated with the decoded JWT payload.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        full_name: string;
        role: Role;
      };
    }
  }
}

export {};
