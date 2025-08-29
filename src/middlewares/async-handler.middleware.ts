import { NextFunction, Request, Response } from "express";

/**
 * Middleware to handle async route controllers.
 * It catches any errors thrown in the controller and passes them to the next middleware.
 *
 * @param {Function} controller - The async controller function to wrap.
 * @returns {Function} - A new function that wraps the controller with error handling.
 */
type AsyncControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler =
  (controller: AsyncControllerType): AsyncControllerType =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
