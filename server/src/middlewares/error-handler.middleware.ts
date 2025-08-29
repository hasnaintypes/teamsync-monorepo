import { ErrorRequestHandler } from "express";
import { HTTP_STATUS } from "../config/http.config";

/**
 * Global error handler middleware.
 * It catches errors thrown in the application and sends a standardized error response.
 *
 * @param {Error} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
  console.error("Error occurred:", err);
  console.error("Request URL:", req.originalUrl);
  console.error("Request Method:", req.method);
  console.error("Request Body:", req.body);
  console.error("Request Headers:", req.headers);
  console.error("Request Path:", req.path);

  if (err instanceof SyntaxError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "error",
      message: "Invalid JSON payload",
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
