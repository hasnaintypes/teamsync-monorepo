import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
} from "../validation/project.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/role-guard";
import { Permissions } from "../enums/role.enum";
import {
  createProjectService,
  deleteProjectService,
  getProjectAnalyticsService,
  getProjectByIdAndWorkspaceIdService,
  getProjectsInWorkspaceService,
  updateProjectService,
} from "../services/project.service";
import { HTTP_STATUS } from "../config/http.config";

/**
 * @swagger
 * /project/:workspaceId/create:
 *   post:
 *     summary: Create a new project in a workspace
 *     description: Creates a new project in the specified workspace. Requires CREATE_PROJECT permission.
 *     tags:
 *       - Project
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
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
 *                 example: "Project Name"
 *               emoji:
 *                 type: string
 *                 example: "🚀"
 *               description:
 *                 type: string
 *                 example: "Project description"
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project created successfully
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
/**
 * Handles project creation in a workspace.
 * Validates user has CREATE_PROJECT permission before creating the project.
 *
 * @param {Request} req - Express request object containing workspace ID and project data
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with project creation success message
 */
export const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createProjectSchema.parse(req.body);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const userId = req.user?._id;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_PROJECT]);

    const { project } = await createProjectService(userId, workspaceId, {
      emoji: body.emoji,
      name: body.name,
      description: body.description,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      message: "Project created successfully",
      project,
    });
  }
);

/**
 * @swagger
 * /project/:workspaceId/all:
 *   get:
 *     summary: Get all projects in a workspace
 *     description: Retrieves all projects in the specified workspace with pagination. Requires VIEW_ONLY permission.
 *     tags:
 *       - Project
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of projects per page
 *       - in: query
 *         name: pageNumber
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page number to retrieve
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project fetched successfully
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     pageNumber:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     skip:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
/**
 * Handles retrieving all projects in a workspace with pagination.
 * Validates user has VIEW_ONLY permission before returning projects.
 *
 * @param {Request} req - Express request object containing workspace ID and pagination query
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with projects and pagination info
 */
export const getAllProjectsInWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;

    const { projects, totalCount, totalPages, skip } =
      await getProjectsInWorkspaceService(workspaceId, pageSize, pageNumber);

    return res.status(HTTP_STATUS.OK).json({
      message: "Project fetched successfully",
      projects,
      pagination: {
        totalCount,
        pageSize,
        pageNumber,
        totalPages,
        skip,
        limit: pageSize,
      },
    });
  }
);

/**
 * @swagger
 * /project/:workspaceId/:id:
 *   get:
 *     summary: Get project by ID in workspace
 *     description: Retrieves a specific project by its ID in the specified workspace. Requires VIEW_ONLY permission.
 *     tags:
 *       - Project
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project fetched successfully
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Project not found
 */
/**
 * Handles retrieving a project by its ID in a workspace.
 * Validates user has VIEW_ONLY permission before returning project details.
 *
 * @param {Request} req - Express request object containing workspace ID and project ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with project details
 */
export const getProjectByIdAndWorkspaceIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { project } = await getProjectByIdAndWorkspaceIdService(
      workspaceId,
      projectId
    );

    return res.status(HTTP_STATUS.OK).json({
      message: "Project fetched successfully",
      project,
    });
  }
);

/**
 * @swagger
 * /project/:workspaceId/:id/analytics:
 *   get:
 *     summary: Get project analytics
 *     description: Retrieves analytics data for a project including task statistics. Requires VIEW_ONLY permission.
 *     tags:
 *       - Project
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project analytics retrieved successfully
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
 *         description: Project not found
 */
/**
 * Handles retrieving project analytics.
 * Validates user has VIEW_ONLY permission before returning analytics data.
 *
 * @param {Request} req - Express request object containing workspace ID and project ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with project analytics
 */
export const getProjectAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { analytics } = await getProjectAnalyticsService(
      workspaceId,
      projectId
    );

    return res.status(HTTP_STATUS.OK).json({
      message: "Project analytics retrieved successfully",
      analytics,
    });
  }
);

/**
 * @swagger
 * /project/:workspaceId/:id/update:
 *   put:
 *     summary: Update project
 *     description: Updates project details in a workspace. Requires EDIT_PROJECT permission.
 *     tags:
 *       - Project
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
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
 *                 example: "Updated Project Name"
 *               emoji:
 *                 type: string
 *                 example: "🎯"
 *               description:
 *                 type: string
 *                 example: "Updated project description"
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project updated successfully
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Project not found
 */
/**
 * Handles updating a project in a workspace.
 * Validates user has EDIT_PROJECT permission before updating project details.
 *
 * @param {Request} req - Express request object containing workspace ID, project ID, and update data
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with updated project information
 */
export const updateProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const body = updateProjectSchema.parse(req.body);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_PROJECT]);

    const { project } = await updateProjectService(
      workspaceId,
      projectId,
      {
        emoji: body.emoji,
        name: body.name,
        description: body.description,
      }
    );

    return res.status(HTTP_STATUS.OK).json({
      message: "Project updated successfully",
      project,
    });
  }
);

/**
 * @swagger
 * /project/:workspaceId/:id/delete:
 *   delete:
 *     summary: Delete project
 *     description: Deletes a project and all its associated tasks from a workspace. Requires DELETE_PROJECT permission.
 *     tags:
 *       - Project
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Project not found
 */
/**
 * Handles deleting a project from a workspace.
 * Validates user has DELETE_PROJECT permission before performing deletion.
 *
 * @param {Request} req - Express request object containing workspace ID and project ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with deletion confirmation
 */
export const deleteProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_PROJECT]);

    await deleteProjectService(workspaceId, projectId);

    return res.status(HTTP_STATUS.OK).json({
      message: "Project deleted successfully",
    });
  }
);
