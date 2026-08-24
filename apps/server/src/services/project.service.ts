import mongoose from "mongoose";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import { NotFoundException } from "../utils/app-error";
import { TaskStatusEnum } from "../enums/task.enum";

/**
 * Creates a new project in the specified workspace.
 *
 * @param {string} userId - The ID of the user creating the project
 * @param {string} workspaceId - The ID of the workspace to add the project to
 * @param {Object} body - The project creation data
 * @param {string} body.name - The name of the project
 * @param {string} [body.emoji] - Optional emoji for the project
 * @param {string} [body.description] - Optional description for the project
 * @returns {Promise<{ project: typeof ProjectModel }>} The created project object
 */
export const createProjectService = async (
  userId: string,
  workspaceId: string,
  body: {
    emoji?: string;
    name: string;
    description?: string;
  }
) => {
  const project = new ProjectModel({
    ...(body.emoji && { emoji: body.emoji }),
    name: body.name,
    description: body.description,
    workspace: workspaceId,
    createdBy: userId,
  });

  await project.save();

  return { project };
};

/**
 * Retrieves all projects in a workspace with pagination.
 *
 * @param {string} workspaceId - The ID of the workspace
 * @param {number} pageSize - Number of projects per page
 * @param {number} pageNumber - Page number to retrieve
 * @returns {Promise<{ projects: Array, totalCount: number, totalPages: number, skip: number }>} Paginated projects and metadata
 */
export const getProjectsInWorkspaceService = async (
  workspaceId: string,
  pageSize: number,
  pageNumber: number
) => {
  // Step 1: Find all projects in the workspace

  const totalCount = await ProjectModel.countDocuments({
    workspace: workspaceId,
  });

  const skip = (pageNumber - 1) * pageSize;

  const projects = await ProjectModel.find({
    workspace: workspaceId,
  })
    .skip(skip)
    .limit(pageSize)
    .populate("createdBy", "_id name profilePicture -password")
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(totalCount / pageSize);

  return { projects, totalCount, totalPages, skip };
};

/**
 * Retrieves a project by its ID and workspace ID.
 *
 * @param {string} workspaceId - The ID of the workspace
 * @param {string} projectId - The ID of the project
 * @returns {Promise<{ project: typeof ProjectModel }>} The project object
 * @throws {NotFoundException} When the project is not found or does not belong to the workspace
 */
export const getProjectByIdAndWorkspaceIdService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  }).select("_id emoji name description");

  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace"
    );
  }

  return { project };
};

/**
 * Generates analytics data for a specific project within a workspace.
 * Calculates total, overdue, and completed tasks using aggregation.
 *
 * @param {string} workspaceId - The ID of the workspace
 * @param {string} projectId - The ID of the project
 * @returns {Promise<{ analytics: Object }>} Object containing project analytics data
 * @throws {NotFoundException} When the project is not found or does not belong to the workspace
 */
export const getProjectAnalyticsService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const currentDate = new Date();

  //USING Mongoose aggregate
  const taskAnalytics = await TaskModel.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $facet: {
        totalTasks: [{ $count: "count" }],
        overdueTasks: [
          {
            $match: {
              dueDate: { $lt: currentDate },
              status: {
                $ne: TaskStatusEnum.DONE,
              },
            },
          },
          {
            $count: "count",
          },
        ],
        completedTasks: [
          {
            $match: {
              status: TaskStatusEnum.DONE,
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  const _analytics = taskAnalytics[0];

  const analytics = {
    totalTasks: _analytics.totalTasks[0]?.count || 0,
    overdueTasks: _analytics.overdueTasks[0]?.count || 0,
    completedTasks: _analytics.completedTasks[0]?.count || 0,
  };

  return {
    analytics,
  };
};

/**
 * Updates a project in a workspace.
 *
 * @param {string} workspaceId - The ID of the workspace
 * @param {string} projectId - The ID of the project to update
 * @param {Object} body - The project update data
 * @param {string} [body.emoji] - Optional new emoji for the project
 * @param {string} body.name - The new name for the project
 * @param {string} [body.description] - Optional new description for the project
 * @returns {Promise<{ project: typeof ProjectModel }>} The updated project object
 * @throws {NotFoundException} When the project is not found or does not belong to the workspace
 */
export const updateProjectService = async (
  workspaceId: string,
  projectId: string,
  body: {
    emoji?: string;
    name: string;
    description?: string;
  }
) => {
  const { name, emoji, description } = body;

  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace"
    );
  }

  if (emoji) project.emoji = emoji;
  if (name) project.name = name;
  if (description) project.description = description;

  await project.save();

  return { project };
};

/**
 * Deletes a project and all its associated tasks from a workspace.
 *
 * @param {string} workspaceId - The ID of the workspace
 * @param {string} projectId - The ID of the project to delete
 * @returns {Promise<typeof ProjectModel>} The deleted project object
 * @throws {NotFoundException} When the project is not found or does not belong to the workspace
 */
export const deleteProjectService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace"
    );
  }

  await project.deleteOne();

  await TaskModel.deleteMany({
    project: project._id,
  });

  return project;
};
