import UserModel from "../models/user.model";
import { BadRequestException } from "../utils/app-error";

/**
 * Retrieves the current user by their ID and populates the current workspace.
 *
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<{ user: any }>} - An object containing the user data.
 * @throws {BadRequestException} - If the user is not found.
 */
export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .populate("currentWorkspace")
    .select("-password");

  if (!user) {
    throw new BadRequestException("User not found");
  }

  return {
    user,
  };
};
