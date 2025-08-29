import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import {
  changeRoleSchema,
  createWorkspaceSchema,
  workspaceIdSchema,
} from "../validation/workspace.validation";
import { HTTP_STATUS } from "../config/http.config";
import {
  changeMemberRoleService,
  createWorkspaceService,
  deleteWorkspaceService,
  getAllWorkspacesUserIsMemberService,
  getWorkspaceAnalyticsService,
  getWorkspaceByIdService,
  getWorkspaceMembersService,
  updateWorkspaceByIdService,
} from "../services/workspace.service";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { Permissions } from "../enums/role.enum";
import { roleGuard } from "../utils/role-guard";
import { updateWorkspaceSchema } from "../validation/workspace.validation";

/**
 * @swagger
 * /workspace/create/new:
 *   post:
 *     summary: Create a new workspace
 *     description: Creates a new workspace with the authenticated user as the owner.
 *     tags:
 *       - Workspace
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Team Workspace"
 *               description:
 *                 type: string
 *                 example: "A workspace for my team's projects"
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Workspace created successfully
 *                 workspace:
 *                   $ref: '#/components/schemas/Workspace'
 *       401:
 *         description: Unauthorized
 */

/**
 * Handles workspace creation.
 * Creates a new workspace with the authenticated user as the owner and automatically adds them as a member.
 *
 * @param {Request} req - Express request object containing workspace data
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with workspace creation success message
 */
export const createWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createWorkspaceSchema.parse(req.body);

    const userId = req.user?._id;
    const { workspace } = await createWorkspaceService(userId, {
      name: body.name,
      description: body.description,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      message: "Workspace created successfully",
      workspace,
    });
  }
);

/**
 * @swagger
 * /workspace/all:
 *   get:
 *     summary: Get all workspaces for user
 *     description: Retrieves all workspaces where the authenticated user is a member.
 *     tags:
 *       - Workspace
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: User workspaces fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User workspaces fetched successfully
 *                 workspaces:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workspace'
 *       401:
 *         description: Unauthorized
 */

/**
 * Handles retrieving all workspaces for the authenticated user.
 * Returns all workspaces where the user is a member.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with user workspaces
 */
export const getAllWorkspacesUserIsMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { workspaces } = await getAllWorkspacesUserIsMemberService(userId);

    return res.status(HTTP_STATUS.OK).json({
      message: "User workspaces fetched successfully",
      workspaces,
    });
  }
);

/**
 * @swagger
 * /workspace/{id}:
 *   get:
 *     summary: Get workspace by ID
 *     description: Retrieves a specific workspace with its members. User must be a member of the workspace.
 *     tags:
 *       - Workspace
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Workspace fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Workspace fetched successfully
 *                 workspace:
 *                   $ref: '#/components/schemas/Workspace'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace not found
 */

/**
 * Handles retrieving a specific workspace by ID.
 * Validates user membership before returning workspace details.
 *
 * @param {Request} req - Express request object containing workspace ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with workspace details
 */
export const getWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    await getMemberRoleInWorkspace(userId, workspaceId);

    const { workspace } = await getWorkspaceByIdService(workspaceId);

    return res.status(HTTP_STATUS.OK).json({
      message: "Workspace fetched successfully",
      workspace,
    });
  }
);

/**
 * @swagger
 * /workspace/members/{id}:
 *   get:
 *     summary: Get workspace members
 *     description: Retrieves all members of a workspace along with available roles. Requires VIEW_ONLY permission.
 *     tags:
 *       - Workspace
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Workspace members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Workspace members retrieved successfully
 *                 members:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Member'
 *                 roles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Workspace not found
 */

/**
 * Handles retrieving workspace members and available roles.
 * Validates user has VIEW_ONLY permission before returning member data.
 *
 * @param {Request} req - Express request object containing workspace ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with workspace members and roles
 */
export const getWorkspaceMembersController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { members, roles } = await getWorkspaceMembersService(workspaceId);

    return res.status(HTTP_STATUS.OK).json({
      message: "Workspace members retrieved successfully",
      members,
      roles,
    });
  }
);

/**
 * @swagger
 * /workspace/analytics/{id}:
 *   get:
 *     summary: Get workspace analytics
 *     description: Retrieves analytics data for a workspace including task statistics. Requires VIEW_ONLY permission.
 *     tags:
 *       - Workspace
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Workspace analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Workspace analytics retrieved successfully
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     totalTasks:
 *                       type: number
 *                       example: 25
 *                     overdueTasks:
 *                       type: number
 *                       example: 3
 *                     completedTasks:
 *                       type: number
 *                       example: 15
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Workspace not found
 */

/**
 * Handles retrieving workspace analytics.
 * Validates user has VIEW_ONLY permission before returning analytics data.
 *
 * @param {Request} req - Express request object containing workspace ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with workspace analytics
 */
export const getWorkspaceAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

    return res.status(HTTP_STATUS.OK).json({
      message: "Workspace analytics retrieved successfully",
      analytics,
    });
  }
);

/**
 * @swagger
 * /workspace/change/member/role/{id}:
 *   put:
 *     summary: Change member role
 *     description: Changes the role of a workspace member. Requires CHANGE_MEMBER_ROLE permission.
 *     tags:
 *       - Workspace
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberId
 *               - roleId
 *             properties:
 *               memberId:
 *                 type: string
 *                 example: "64c8b2f2e1a2c8a1b2f2e1a3"
 *               roleId:
 *                 type: string
 *                 example: "64c8b2f2e1a2c8a1b2f2e1a4"
 *     responses:
 *       200:
 *         description: Member role changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Member Role changed successfully
 *                 member:
 *                   $ref: '#/components/schemas/Member'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Workspace, member, or role not found
 */

/**
 * Handles changing a workspace member's role.
 * Validates user has CHANGE_MEMBER_ROLE permission before updating the member's role.
 *
 * @param {Request} req - Express request object containing workspace ID and role change data
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with updated member information
 */
export const changeWorkspaceMemberRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { memberId, roleId } = changeRoleSchema.parse(req.body);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

    const { member } = await changeMemberRoleService(
      workspaceId,
      memberId,
      roleId
    );

    return res.status(HTTP_STATUS.OK).json({
      message: "Member Role changed successfully",
      member,
    });
  }
);

/**
 * @swagger
 * /workspace/update/{id}:
 *   put:
 *     summary: Update workspace
 *     description: Updates workspace name and description. Requires EDIT_WORKSPACE permission.
 *     tags:
 *       - Workspace
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Workspace Name"
 *               description:
 *                 type: string
 *                 example: "Updated workspace description"
 *     responses:
 *       200:
 *         description: Workspace updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Workspace updated successfully
 *                 workspace:
 *                   $ref: '#/components/schemas/Workspace'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Workspace not found
 */

/**
 * Handles updating a workspace's details.
 * Validates user has EDIT_WORKSPACE permission before updating workspace name and description.
 *
 * @param {Request} req - Express request object containing workspace ID and update data
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with updated workspace information
 */
export const updateWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { name, description } = updateWorkspaceSchema.parse(req.body);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_WORKSPACE]);

    const { workspace } = await updateWorkspaceByIdService(
      workspaceId,
      name,
      description
    );

    return res.status(HTTP_STATUS.OK).json({
      message: "Workspace updated successfully",
      workspace,
    });
  }
);

/**
 * @swagger
 * /workspace/delete/{id}:
 *   delete:
 *     summary: Delete workspace
 *     description: Deletes a workspace and all associated data including projects, tasks, and memberships. Requires DELETE_WORKSPACE permission (typically owner only).
 *     tags:
 *       - Workspace
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Workspace deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Workspace deleted successfully
 *                 currentWorkspace:
 *                   type: string
 *                   nullable: true
 *                   example: "64c8b2f2e1a2c8a1b2f2e1a5"
 *                   description: The user's new current workspace ID, or null if no other workspaces
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Workspace not found
 */

/**
 * Handles deleting a workspace and all its associated data.
 * Validates user has DELETE_WORKSPACE permission before performing deletion.
 * Updates the user's current workspace if the deleted workspace was their current one.
 *
 * @param {Request} req - Express request object containing workspace ID
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with deletion confirmation and new current workspace
 */
export const deleteWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_WORKSPACE]);

    const { currentWorkspace } = await deleteWorkspaceService(
      workspaceId,
      userId
    );

    return res.status(HTTP_STATUS.OK).json({
      message: "Workspace deleted successfully",
      currentWorkspace,
    });
  }
);
