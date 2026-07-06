import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import logger from "../config/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.code,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  logger.error("Unhandled error", { error: err.message, stack: err.stack });

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: { code: "INTERNAL_ERROR" },
  });
};
