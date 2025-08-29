import mongoose, { Document, Schema } from "mongoose";
import { generateInviteCode } from "../utils/uuid";

/**
 * Workspace model interface representing a workspace in the system.
 * This model is used to manage workspaces, including their name, description, and owner.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Workspace:
 *       type: object
 *       required:
 *         - name
 *         - owner
 *         - inviteCode
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the workspace
 *           example: "Design Team"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Description of the workspace
 *           example: "Workspace for the design team"
 *         owner:
 *           type: string
 *           format: objectId
 *           description: Reference to the User who owns the workspace
 *           example: "64c8b2f2e1a2c8a1b2f2e1a2"
 *         inviteCode:
 *           type: string
 *           description: Unique invite code for joining the workspace
 *           example: "INVITE-12345"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Workspace creation timestamp
 *           example: "2025-08-02T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2025-08-02T13:00:00Z"
 */
export interface WorkspaceDocument extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

const workspaceSchema = new Schema<WorkspaceDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model (the workspace creator)
      required: true,
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      default: generateInviteCode,
    },
  },
  {
    timestamps: true,
  }
);

workspaceSchema.methods.resetInviteCode = function () {
  this.inviteCode = generateInviteCode();
};

const WorkspaceModel = mongoose.model<WorkspaceDocument>(
  "Workspace",
  workspaceSchema
);

export default WorkspaceModel;
