import { ErrorRequestHandler } from "express";
import { HTTP_STATUS } from "../config/http.config";
import { AppError } from "../utils/app-error";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next): void => {
  logger.error(`${req.method} ${req.originalUrl}:`, err.message);

  if (err instanceof SyntaxError) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid JSON payload",
      errorCode: "VALIDATION_ERROR",
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Validation failed",
      errorCode: "VALIDATION_ERROR",
      errors: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
    });
    return;
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    errorCode: "INTERNAL_SERVER_ERROR",
  });
};
