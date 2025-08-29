import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/role.model";
import { Roles } from "../enums/role.enum";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";
import MemberModel from "../models/member.model";
import { ProviderEnum } from "../enums/auth-provider.enum";

/**
 * NOTE: This service uses Mongoose sessions and transactions to ensure atomicity and consistency
 * when creating users, accounts, workspaces, and members. If any step fails, all changes are rolled back.
 * Sessions are especially useful for multi-document operations that must succeed or fail together.
 *
 * Creates or logs in a user using a third-party provider. If the user does not exist, creates the user,
 * associated account, workspace, and member entry, all within a transaction.
 *
 * @param {Object} data - The login or account creation data
 * @param {string} data.provider - The authentication provider (e.g., Google, GitHub)
 * @param {string} data.displayName - The display name of the user
 * @param {string} data.providerId - The unique provider ID for the user
 * @param {string} [data.picture] - Optional profile picture URL
 * @param {string} [data.email] - Optional email address
 * @returns {Promise<{ user: typeof UserModel }>} The user object
 */
const loginOrCreateAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) => {
  const { providerId, provider, displayName, email, picture } = data;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log(
      "[AuthService][loginOrCreateAccountService] Started session for login or account creation"
    );

    let user = await UserModel.findOne({ email }).session(session);

    if (!user) {
      // Create a new user if it doesn't exist
      user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });

      const account = new AccountModel({
        userId: user._id,
        provider: provider,
        providerId: providerId,
      });
      await account.save({ session });

      // 3. Create a new workspace for the new user
      const workspace = new WorkspaceModel({
        name: `My Workspace`,
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });

      const ownerRole = await RoleModel.findOne({
        name: Roles.OWNER,
      }).session(session);

      if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
      }

      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    console.log(
      "[AuthService][loginOrCreateAccountService] Ended session and committed transaction"
    );

    return { user };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(
      "[AuthService][loginOrCreateAccountService] Transaction aborted due to error:",
      error
    );
    throw error;
  } finally {
    session.endSession();
  }
};
export { loginOrCreateAccountService };

/**
 * NOTE: Uses Mongoose sessions and transactions for atomic user registration and related resource creation.
 * Registers a new user with email, name, and password. Also creates an account, workspace, and member entry.
 *
 * @param {Object} body - The registration data
 * @param {string} body.email - The user's email address
 * @param {string} body.name - The user's name
 * @param {string} body.password - The user's password
 * @returns {Promise<{ userId: mongoose.Types.ObjectId, workspaceId: mongoose.Types.ObjectId }>} The new user's ID and workspace ID
 */
const registerUserService = async (body: {
  email: string;
  name: string;
  password: string;
}) => {
  const { email, name, password } = body;
  const session = await mongoose.startSession();

  try {
    console.log(
      "[AuthService][registerUserService] Started session for user registration"
    );
    session.startTransaction();

    const existingUser = await UserModel.findOne({ email }).session(session);
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const user = new UserModel({
      email,
      name,
      password,
    });
    await user.save({ session });

    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });
    await account.save({ session });

    // 3. Create a new workspace for the new user
    const workspace = new WorkspaceModel({
      name: `My Workspace`,
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save({ session });

    const ownerRole = await RoleModel.findOne({
      name: Roles.OWNER,
    }).session(session);

    if (!ownerRole) {
      throw new NotFoundException("Owner role not found");
    }

    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save({ session });

    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    console.log(
      "[AuthService][registerUserService] Ended session and committed transaction"
    );

    return {
      userId: user._id,
      workspaceId: workspace._id,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(
      "[AuthService][registerUserService] Transaction aborted due to error:",
      error
    );
    throw error;
  }
};
export { registerUserService };

/**
 * Verifies a user's credentials for login.
 *
 * @param {Object} params - The verification parameters
 * @param {string} params.email - The user's email address
 * @param {string} params.password - The user's password
 * @param {string} [params.provider=ProviderEnum.EMAIL] - The authentication provider
 * @returns {Promise<Object>} The user object without the password
 */
const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) => {
  const account = await AccountModel.findOne({ provider, providerId: email });
  if (!account) {
    throw new NotFoundException("Invalid email or password");
  }

  const user = await UserModel.findById(account.userId);

  if (!user) {
    throw new NotFoundException("User not found for the given account");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedException("Invalid email or password");
  }

  return user.omitPassword();
};
export { verifyUserService };
