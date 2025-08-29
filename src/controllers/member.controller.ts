import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { z } from "zod";
import { HTTP_STATUS } from "../config/http.config";
import { joinWorkspaceByInviteService } from "../services/member.service";

/**
 * @swagger
 * /member/{inviteCode}/join:
 *   post:
 *     summary: Join workspace by invite code
 *     description: Allows an authenticated user to join a workspace using an invite code.
 *     tags:
 *       - Member
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The invite code for the workspace
 *     responses:
 *       200:
 *         description: Successfully joined the workspace
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully joined the workspace
 *                 workspaceId:
 *                   type: string
 *                   example: "64c8b2f2e1a2c8a1b2f2e1a3"
 *                 role:
 *                   type: string
 *                   example: MEMBER
 *       400:
 *         description: Bad request (invalid invite code or already a member)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace or role not found
 */

/**
 * Handles joining a workspace by invite code.
 * Validates the invite code and adds the authenticated user as a member.
 *
 * @param {Request} req - Express request object containing invite code in params
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with workspace join confirmation
 */
export const joinWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const inviteCode = z.string().parse(req.params.inviteCode);
    const userId = req.user?._id;

    const { workspaceId, role } = await joinWorkspaceByInviteService(
      userId,
      inviteCode
    );

    return res.status(HTTP_STATUS.OK).json({
      message: "Successfully joined the workspace",
      workspaceId,
      role,
    });
  }
);
