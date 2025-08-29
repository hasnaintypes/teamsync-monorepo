import { ErrorCodeEnum } from "../enums/error-code.enum";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/role.model";
import WorkspaceModel from "../models/workspace.model";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";

/**
 * Retrieves the role of a specific member within a workspace.
 * Validates that both the workspace exists and the user is a member of it.
 *
 * @param {string} userId - The ID of the user to check the role for
 * @param {string} workspaceId - The ID of the workspace to check membership in
 * @returns {Promise<{ role: string }>} Object containing the member's role name
 * @throws {NotFoundException} When the workspace is not found
 * @throws {UnauthorizedException} When the user is not a member of the workspace
 */
export const getMemberRoleInWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate("role");

  if (!member) {
    throw new UnauthorizedException(
      "You are not a member of this workspace",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }

  const roleName = member.role?.name;

  return { role: roleName };
};

/**
 * Allows a user to join a workspace using an invite code.
 * Validates the invite code, checks for existing membership, and adds the user as a MEMBER.
 *
 * @param {string} userId - The ID of the user joining the workspace
 * @param {string} inviteCode - The invite code for the workspace
 * @returns {Promise<{ workspaceId: mongoose.Types.ObjectId, role: string }>} Object containing the workspace ID and assigned role
 * @throws {NotFoundException} When the invite code is invalid, workspace not found, or role not found
 * @throws {BadRequestException} When the user is already a member of the workspace
 */
export const joinWorkspaceByInviteService = async (
  userId: string,
  inviteCode: string
) => {
  // Find workspace by invite code
  const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();
  if (!workspace) {
    throw new NotFoundException("Invalid invite code or workspace not found");
  }

  const existingMember = await MemberModel.findOne({
    userId,
    workspaceId: workspace._id,
  }).exec();

  if (existingMember) {
    throw new BadRequestException("You are already a member of this workspace");
  }

  const role = await RoleModel.findOne({ name: Roles.MEMBER });

  if (!role) {
    throw new NotFoundException("Role not found");
  }

  // Add user to workspace as a member
  const newMember = new MemberModel({
    userId,
    workspaceId: workspace._id,
    role: role._id,
  });
  await newMember.save();

  return { workspaceId: workspace._id, role: role.name };
};
