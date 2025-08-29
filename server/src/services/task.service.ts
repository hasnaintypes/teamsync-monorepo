import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";
import MemberModel from "../models/member.model";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";

/**
 * Creates a new task in a project within a workspace.
 * Validates project existence and assigned user membership.
 *
 * @param {string} workspaceId - The ID of the workspace
 * @param {string} projectId - The ID of the project
 * @param {string} userId - The ID of the user creating the task
 * @param {Object} body - The task creation data
 * @param {string} body.title - The title of the task
 * @param {string} [body.description] - Optional description of the task
 * @param {string} body.priority - The priority of the task
 * @param {string} body.status - The status of the task
 * @param {string} [body.assignedTo] - Optional user ID to assign the task to
 * @param {string} [body.dueDate] - Optional due date for the task
 * @returns {Promise<{ task: typeof TaskModel }>} The created task object
 * @throws {NotFoundException} When project is not found or not in workspace
 * @throws {Error} When assigned user is not a member of the workspace
 */
export const createTaskService = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  body: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;

  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }
  if (assignedTo) {
    const isAssignedUserMember = await MemberModel.exists({
      userId: assignedTo,
      workspaceId,
    });

    if (!isAssignedUserMember) {
      throw new Error("Assigned user is not a member of this workspace.");
    }
  }
  const task = new TaskModel({
    title,
    description,
    priority: priority || TaskPriorityEnum.MEDIUM,
    status: status || TaskStatusEnum.TODO,
    assignedTo,
    createdBy: userId,
    workspace: workspaceId,
    project: projectId,
    dueDate,
  });

  await task.save();

  return { task };
};

/**
 * Updates an existing task in a project within a workspace.
 * Validates project and task existence and association.
 *
 * @param {string} workspaceId - The ID of the workspace
 * @param {string} projectId - The ID of the project
 * @param {string} taskId - The ID of the task to update
 * @param {Object} body - The task update data
 * @returns {Promise<{ updatedTask: typeof TaskModel }>} The updated task object
 * @throws {NotFoundException} When project or task is not found or not associated
 * @throws {BadRequestException} When update fails
 */
export const updateTaskService = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  body: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const task = await TaskModel.findById(taskId);

  if (!task || task.project.toString() !== projectId.toString()) {
    throw new NotFoundException(
      "Task not found or does not belong to this project"
    );
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    {
      ...body,
    },
    { new: true }
  );

  if (!updatedTask) {
    throw new BadRequestException("Failed to update task");
  }

  return { updatedTask };
};

/**
 * Retrieves all tasks in a workspace, optionally filtered and paginated.
 * Supports filtering by project, status, priority, assigned user, keyword, and due date.
 *
 * @param {string} workspaceId - The ID of the workspace
 * @param {Object} filters - Filtering options
 * @param {string} [filters.projectId] - Optional project ID to filter tasks
 * @param {string[]} [filters.status] - Optional array of statuses to filter
 * @param {string[]} [filters.priority] - Optional array of priorities to filter
 * @param {string[]} [filters.assignedTo] - Optional array of user IDs to filter
 * @param {string} [filters.keyword] - Optional keyword to search in task titles
 * @param {string} [filters.dueDate] - Optional due date to filter
 * @param {Object} pagination - Pagination options
 * @param {number} pagination.pageSize - Number of tasks per page
 * @param {number} pagination.pageNumber - Page number to retrieve
 * @returns {Promise<{ tasks: Array, pagination: Object }>} Array of tasks and pagination info
 */
export const getAllTasksService = async (
  workspaceId: string,
  filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const query: Record<string, any> = {
    workspace: workspaceId,
  };

  if (filters.projectId) {
    query.project = filters.projectId;
  }

  if (filters.status && filters.status?.length > 0) {
    query.status = { $in: filters.status };
  }

  if (filters.priority && filters.priority?.length > 0) {
    query.priority = { $in: filters.priority };
  }

  if (filters.assignedTo && filters.assignedTo?.length > 0) {
    query.assignedTo = { $in: filters.assignedTo };
  }

  if (filters.keyword && filters.keyword !== undefined) {
    query.title = { $regex: filters.keyword, $options: "i" };
  }

  if (filters.dueDate) {
    query.dueDate = {
      $eq: new Date(filters.dueDate),
    };
  }

  //Pagination Setup
  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [tasks, totalCount] = await Promise.all([
    TaskModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "_id name profilePicture -password")
      .populate("project", "_id emoji name"),
    TaskModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    tasks,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

/**
 * Retrieves a specific task by its ID within a project and workspace.
 * Validates project and task existence and association.
 *
 * @param {string} workspaceId - The ID of the workspace
 * @param {string} projectId - The ID of the project
 * @param {string} taskId - The ID of the task to retrieve
 * @returns {Promise<typeof TaskModel>} The task object
 * @throws {NotFoundException} When project or task is not found or not associated
 */
export const getTaskByIdService = async (
  workspaceId: string,
  projectId: string,
  taskId: string
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const task = await TaskModel.findOne({
    _id: taskId,
    workspace: workspaceId,
    project: projectId,
  }).populate("assignedTo", "_id name profilePicture -password");

  if (!task) {
    throw new NotFoundException("Task not found.");
  }

  return task;
};

/**
 * Deletes a specific task from a workspace.
 * Validates task existence and association with the workspace.
 *
 * @param {string} workspaceId - The ID of the workspace
 * @param {string} taskId - The ID of the task to delete
 * @returns {Promise<void>} Resolves if deletion is successful
 * @throws {NotFoundException} When task is not found or not in workspace
 */
export const deleteTaskService = async (
  workspaceId: string,
  taskId: string
) => {
  const task = await TaskModel.findOneAndDelete({
    _id: taskId,
    workspace: workspaceId,
  });

  if (!task) {
    throw new NotFoundException(
      "Task not found or does not belong to the specified workspace"
    );
  }

  return;
};
