import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate";
import { ApiError } from "../utils/apiError";

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.forbidden("Not authenticated"));
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden("Insufficient permissions"));
    }
    next();
  };
};
