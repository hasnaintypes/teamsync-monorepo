import mongoose, { Document, Schema } from "mongoose";

/**
 * Project Model represents a project within a workspace.
 * Each project is associated with a workspace and has a creator.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - workspace
 *         - createdBy
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the project
 *           example: "Marketing Website Redesign"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Optional description for the project
 *           example: "Redesign the company marketing website for Q3."
 *         emoji:
 *           type: string
 *           description: Emoji representing the project
 *           example: "📊"
 *         workspace:
 *           type: string
 *           format: objectId
 *           description: Reference to the Workspace
 *           example: "64c8b2f2e1a2c8a1b2f2e1a3"
 *         createdBy:
 *           type: string
 *           format: objectId
 *           description: Reference to the User who created the project
 *           example: "64c8b2f2e1a2c8a1b2f2e1a2"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Project creation timestamp
 *           example: "2025-08-02T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2025-08-02T13:00:00Z"
 */
export interface ProjectDocument extends Document {
  name: string;
  description: string | null; // Optional description for the project
  emoji: string;
  workspace: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    emoji: {
      type: String,
      required: false,
      trim: true,
      default: "📊",
    },
    description: { type: String, required: false },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);
export default ProjectModel;
