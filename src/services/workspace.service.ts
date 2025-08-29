import mongoose from "mongoose";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/role.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import TaskModel from "../models/task.model";
import { TaskStatusEnum } from "../enums/task.enum";
import ProjectModel from "../models/project.model";

/**
 * Creates a new workspace for the specified user.
 * The user becomes the owner of the workspace and is automatically added as a member with OWNER role.
 *
 * @param {string} userId - The ID of the user creating the workspace
 * @param {Object} body - The workspace creation data
 * @param {string} body.name - The name of the workspace
 * @param {string} [body.description] - Optional description of the workspace
 * @returns {Promise<{ workspace: typeof WorkspaceModel }>} The created workspace object
 * @throws {NotFoundException} When the user or owner role is not found
 */
export const createWorkspaceService = async (
  userId: string,
  body: {
    name: string;
    description?: string | undefined;
  }
) => {
  const { name, description } = body;

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });

  if (!ownerRole) {
    throw new NotFoundException("Owner role not found");
  }

  const workspace = new WorkspaceModel({
    name: name,
    description: description,
    owner: user._id,
  });

  await workspace.save();

  const member = new MemberModel({
    userId: user._id,
    workspaceId: workspace._id,
    role: ownerRole._id,
    joinedAt: new Date(),
  });

  await member.save();

  user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
  await user.save();

  return {
    workspace,
  };
};

/**
 * Retrieves all workspaces where the specified user is a member.
 * Returns the workspace details populated from the member relationships.
 *
 * @param {string} userId - The ID of the user to find workspaces for
 * @returns {Promise<{ workspaces: Array }>} An array of workspaces the user is a member of
 */
export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
  const memberships = await MemberModel.find({ userId })
    .populate("workspaceId")
    .select("-password")
    .exec();

  // Extract workspace details from memberships
  const workspaces = memberships.map((membership) => membership.workspaceId);

  return { workspaces };
};

/**
 * Retrieves a specific workspace by its ID along with all its members.
 * Populates member details including their roles.
 *
 * @param {string} workspaceId - The ID of the workspace to retrieve
 * @returns {Promise<{ workspace: Object }>} The workspace object with populated members
 * @throws {NotFoundException} When the workspace is not found
 */
export const getWorkspaceByIdService = async (workspaceId: string) => {
  const workspace = await WorkspaceModel.findById(workspaceId);

  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const members = await MemberModel.find({
    workspaceId,
  }).populate("role");

  const workspaceWithMembers = {
    ...workspace.toObject(),
    members,
  };

  return {
    workspace: workspaceWithMembers,
  };
};

/**
 * Retrieves all members of a specific workspace along with available roles.
 * Populates user information (name, email, profile picture) and role details for each member.
 *
 * @param {string} workspaceId - The ID of the workspace to get members for
 * @returns {Promise<{ members: Array, roles: Array }>} Object containing workspace members and available roles
 */
export const getWorkspaceMembersService = async (workspaceId: string) => {
  // Fetch all members of the workspace

  const members = await MemberModel.find({
    workspaceId,
  })
    .populate("userId", "name email profilePicture -password")
    .populate("role", "name");

  const roles = await RoleModel.find({}, { name: 1, _id: 1 })
    .select("-permission")
    .lean();

  return { members, roles };
};

/**
 * Generates analytics data for a specific workspace.
 * Calculates total tasks, overdue tasks, and completed tasks within the workspace.
 *
 * @param {string} workspaceId - The ID of the workspace to generate analytics for
 * @returns {Promise<{ analytics: Object }>} Object containing workspace analytics data
 */
export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
  const currentDate = new Date();

  const totalTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
  });

  const overdueTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
    dueDate: { $lt: currentDate },
    status: { $ne: TaskStatusEnum.DONE },
  });

  const completedTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
    status: TaskStatusEnum.DONE,
  });

  const analytics = {
    totalTasks,
    overdueTasks,
    completedTasks,
  };

  return { analytics };
};

/**
 * Changes the role of a specific member within a workspace.
 * Validates that both the workspace and role exist before updating the member's role.
 *
 * @param {string} workspaceId - The ID of the workspace
 * @param {string} memberId - The ID of the member whose role should be changed
 * @param {string} roleId - The ID of the new role to assign
 * @returns {Promise<{ member: typeof MemberModel }>} The updated member object
 * @throws {NotFoundException} When workspace or role is not found
 * @throws {Error} When member is not found in the workspace
 */
export const changeMemberRoleService = async (
  workspaceId: string,
  memberId: string,
  roleId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const role = await RoleModel.findById(roleId);
  if (!role) {
    throw new NotFoundException("Role not found");
  }

  const member = await MemberModel.findOne({
    userId: memberId,
    workspaceId: workspaceId,
  });

  if (!member) {
    throw new Error("Member not found in the workspace");
  }

  member.role = role;
  await member.save();

  return {
    member,
  };
};

/**
 * Updates the details of a specific workspace.
 * Allows updating the workspace name and description.
 *
 * @param {string} workspaceId - The ID of the workspace to update
 * @param {string} name - The new name for the workspace
 * @param {string} [description] - Optional new description for the workspace
 * @returns {Promise<{ workspace: typeof WorkspaceModel }>} The updated workspace object
 * @throws {NotFoundException} When the workspace is not found
 */
export const updateWorkspaceByIdService = async (
  workspaceId: string,
  name: string,
  description?: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  // Update the workspace details
  workspace.name = name || workspace.name;
  workspace.description = description || workspace.description;
  await workspace.save();

  return {
    workspace,
  };
};

/**
 * NOTE: This service uses Mongoose sessions and transactions to ensure atomicity and consistency
 * when deleting workspaces and all related data. If any step fails, all changes are rolled back.
 *
 * Deletes a workspace and all its associated data including projects, tasks, and memberships.
 * Only the workspace owner can delete the workspace. Updates the user's currentWorkspace if needed.
 *
 * @param {string} workspaceId - The ID of the workspace to delete
 * @param {string} userId - The ID of the user attempting to delete the workspace
 * @returns {Promise<{ currentWorkspace: mongoose.Types.ObjectId | null }>} The user's new current workspace ID
 * @throws {NotFoundException} When workspace or user is not found
 * @throws {BadRequestException} When user is not authorized to delete the workspace
 */
export const deleteWorkspaceService = async (
  workspaceId: string,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const workspace = await WorkspaceModel.findById(workspaceId).session(
      session
    );
    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    // Check if the user owns the workspace
    if (!workspace.owner.equals(new mongoose.Types.ObjectId(userId))) {
      throw new BadRequestException(
        "You are not authorized to delete this workspace"
      );
    }

    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    await ProjectModel.deleteMany({ workspace: workspace._id }).session(
      session
    );
    await TaskModel.deleteMany({ workspace: workspace._id }).session(session);

    await MemberModel.deleteMany({
      workspaceId: workspace._id,
    }).session(session);

    // Update the user's currentWorkspace if it matches the deleted workspace
    if (user?.currentWorkspace?.equals(workspaceId)) {
      const memberWorkspace = await MemberModel.findOne({ userId }).session(
        session
      );
      // Update the user's currentWorkspace
      user.currentWorkspace = memberWorkspace
        ? memberWorkspace.workspaceId
        : null;

      await user.save({ session });
    }

    await workspace.deleteOne({ session });

    await session.commitTransaction();

    session.endSession();

    return {
      currentWorkspace: user.currentWorkspace,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
