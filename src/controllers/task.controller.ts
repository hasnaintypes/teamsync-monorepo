import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "../validation/task.validation";
import { projectIdSchema } from "../validation/project.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { Permissions } from "../enums/role.enum";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/role-guard";
import {
  createTaskService,
  deleteTaskService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
} from "../services/task.service";
import { HTTP_STATUS } from "../config/http.config";

/**
 * @swagger
 * /task/project/{projectId}/workspace/{workspaceId}/create:
 *   post:
 *     summary: Create a new task in a project
 *     description: Creates a new task in the specified project and workspace. Requires CREATE_TASK permission.
 *     tags:
 *       - Task
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
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
 *               - title
 *               - priority
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Design homepage"
 *               description:
 *                 type: string
 *                 example: "Create initial homepage design"
 *               priority:
 *                 type: string
 *                 example: "HIGH"
 *               status:
 *                 type: string
 *                 example: "TODO"
 *               assignedTo:
 *                 type: string
 *                 example: "64c8b2f2e1a2c8a1b2f2e1a3"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-10T12:00:00Z"
 *     responses:
 *       200:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task created successfully
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
/**
 * Handles task creation in a project and workspace.
 * Validates user has CREATE_TASK permission before creating the task.
 *
 * @param {Request} req - Express request object containing project and workspace IDs and task data
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with task creation success message
 */
export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const body = createTaskSchema.parse(req.body);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_TASK]);

    const { task } = await createTaskService(
      workspaceId,
      projectId,
      userId,
      {
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: body.status,
        assignedTo: body.assignedTo,
        dueDate: body.dueDate,
      }
    );

    return res.status(HTTP_STATUS.OK).json({
      message: "Task created successfully",
      task,
    });
  }
);

/**
 * @swagger
 * /task/{id}/project/{projectId}/workspace/{workspaceId}/update:
 *   put:
 *     summary: Update a task
 *     description: Updates the details of a specific task in a project and workspace. Requires EDIT_TASK permission.
 *     tags:
 *       - Task
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
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
 *               - title
 *               - priority
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Update homepage design"
 *               description:
 *                 type: string
 *                 example: "Revise homepage based on feedback"
 *               priority:
 *                 type: string
 *                 example: "MEDIUM"
 *               status:
 *                 type: string
 *                 example: "IN_PROGRESS"
 *               assignedTo:
 *                 type: string
 *                 example: "64c8b2f2e1a2c8a1b2f2e1a3"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-12T12:00:00Z"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task updated successfully
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Task not found
 */
/**
 * Handles updating a task in a project and workspace.
 * Validates user has EDIT_TASK permission before updating the task.
 *
 * @param {Request} req - Express request object containing task, project, workspace IDs and update data
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with updated task information
 */
export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const body = updateTaskSchema.parse(req.body);

    const taskId = taskIdSchema.parse(req.params.id);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_TASK]);

    const { updatedTask } = await updateTaskService(
      workspaceId,
      projectId,
      taskId,
      {
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: body.status,
        assignedTo: body.assignedTo,
        dueDate: body.dueDate,
      }
    );

    return res.status(HTTP_STATUS.OK).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  }
);

/**
 * @swagger
 * /task/workspace/{workspaceId}/all:
 *   get:
 *     summary: Get all tasks in a workspace
 *     description: Retrieves all tasks in the specified workspace, with optional filters and pagination. Requires VIEW_ONLY permission.
 *     tags:
 *       - Task
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
 *         name: projectId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by project ID
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by status (comma-separated)
 *       - in: query
 *         name: priority
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by priority (comma-separated)
 *       - in: query
 *         name: assignedTo
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by assigned user ID (comma-separated)
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *         description: Search keyword in task title
 *       - in: query
 *         name: dueDate
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by due date
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of tasks per page
 *       - in: query
 *         name: pageNumber
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page number to retrieve
 *     responses:
 *       200:
 *         description: All tasks fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All tasks fetched successfully
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     pageSize:
 *                       type: integer
 *                     pageNumber:
 *                       type: integer
 *                     totalCount:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     skip:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
/**
 * Handles retrieving all tasks in a workspace with optional filters and pagination.
 * Validates user has VIEW_ONLY permission before returning tasks.
 *
 * @param {Request} req - Express request object containing workspace ID and query filters
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with tasks and pagination info
 */
export const getAllTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const filters = {
      projectId: req.query.projectId as string | undefined,
      status: req.query.status
        ? (req.query.status as string)?.split(",")
        : undefined,
      priority: req.query.priority
        ? (req.query.priority as string)?.split(",")
        : undefined,
      assignedTo: req.query.assignedTo
        ? (req.query.assignedTo as string)?.split(",")
        : undefined,
      keyword: req.query.keyword as string | undefined,
      dueDate: req.query.dueDate as string | undefined,
    };

    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 10,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const result = await getAllTasksService(workspaceId, filters, pagination);

    return res.status(HTTP_STATUS.OK).json({
      message: "All tasks fetched successfully",
      ...result,
    });
  }
);

/**
 * @swagger
 * /task/{id}/project/{projectId}/workspace/{workspaceId}:
 *   get:
 *     summary: Get task by ID
 *     description: Retrieves a specific task by its ID in a project and workspace. Requires VIEW_ONLY permission.
 *     tags:
 *       - Task
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task fetched successfully
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Task not found
 */
/**
 * Handles retrieving a specific task by ID in a project and workspace.
 * Validates user has VIEW_ONLY permission before returning task details.
 *
 * @param {Request} req - Express request object containing task, project, workspace IDs in params
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with task details
 */
export const getTaskByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const taskId = taskIdSchema.parse(req.params.id);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const task = await getTaskByIdService(workspaceId, projectId, taskId);

    return res.status(HTTP_STATUS.OK).json({
      message: "Task fetched successfully",
      task,
    });
  }
);

/**
 * @swagger
 * /task/{id}/workspace/{workspaceId}/delete:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a specific task from a workspace. Requires DELETE_TASK permission.
 *     tags:
 *       - Task
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Task not found
 */
/**
 * Handles deleting a task from a workspace.
 * Validates user has DELETE_TASK permission before performing deletion.
 *
 * @param {Request} req - Express request object containing task and workspace IDs in params
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with deletion confirmation
 */
export const deleteTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const taskId = taskIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_TASK]);

    await deleteTaskService(workspaceId, taskId);

    return res.status(HTTP_STATUS.OK).json({
      message: "Task deleted successfully",
    });
  }
);
