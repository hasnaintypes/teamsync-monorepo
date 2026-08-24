import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { getCurrentUserService } from "../services/user.service";

/**
 * @swagger
 * /user/current:
 *   get:
 *     summary: Get current user
 *     description: Retrieves the current authenticated user's information.
 *     tags:
 *       - User
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User fetch successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */

/**
 * Handles fetching the current authenticated user's information.
 * Retrieves user data based on the authenticated session.
 *
 * @param {Request} req - Express request object containing authenticated user
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with current user data
 */
export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(userId);

    return res.status(HTTP_STATUS.OK).json({
      message: "User fetch successfully",
      user,
    });
  }
);
