import mongoose, { Document, Schema } from "mongoose";
import { RoleDocument } from "./role.model";

/**
 * Member document interface representing a user in a workspace
 * This model is used to manage users who are part of a workspace.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - userId
 *         - workspaceId
 *         - role
 *       properties:
 *         userId:
 *           type: string
 *           format: objectId
 *           description: Reference to the User
 *           example: "64c8b2f2e1a2c8a1b2f2e1a2"
 *         workspaceId:
 *           type: string
 *           format: objectId
 *           description: Reference to the Workspace
 *           example: "64c8b2f2e1a2c8a1b2f2e1a3"
 *         role:
 *           type: string
 *           description: Role of the member in the workspace
 *           example: "admin"
 *         joinedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the member joined
 *           example: "2025-08-02T12:34:56Z"
 */
export interface MemberDocument extends Document {
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  role: RoleDocument;
  joinedAt: Date;
}

const memberSchema = new Schema<MemberDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MemberModel = mongoose.model<MemberDocument>("Member", memberSchema);
export default MemberModel;
