import mongoose, { Document, Schema } from "mongoose";
import {
  TaskPriorityEnum,
  TaskPriorityEnumType,
  TaskStatusEnum,
  TaskStatusEnumType,
} from "../enums/task.enum";
import { generateTaskCode } from "../utils/uuid";

/**
 * Task model interface representing a task within a project.
 * This model is used to manage tasks with various attributes such as status, priority, and assignment.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - taskCode
 *         - title
 *         - project
 *         - workspace
 *         - status
 *         - priority
 *         - createdBy
 *       properties:
 *         taskCode:
 *           type: string
 *           description: Unique code for the task
 *           example: "TSK-001"
 *         title:
 *           type: string
 *           description: Title of the task
 *           example: "Design homepage layout"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Detailed description of the task
 *           example: "Create a modern homepage layout for the new website."
 *         project:
 *           type: string
 *           format: objectId
 *           description: Reference to the Project
 *           example: "64c8b2f2e1a2c8a1b2f2e1a4"
 *         workspace:
 *           type: string
 *           format: objectId
 *           description: Reference to the Workspace
 *           example: "64c8b2f2e1a2c8a1b2f2e1a3"
 *         status:
 *           type: string
 *           description: Status of the task
 *           example: "todo"
 *         priority:
 *           type: string
 *           description: Priority of the task
 *           example: "medium"
 *         assignedTo:
 *           type: string
 *           format: objectId
 *           nullable: true
 *           description: User assigned to the task
 *           example: "64c8b2f2e1a2c8a1b2f2e1a2"
 *         createdBy:
 *           type: string
 *           format: objectId
 *           description: User who created the task
 *           example: "64c8b2f2e1a2c8a1b2f2e1a2"
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Due date for the task
 *           example: "2025-08-10T12:00:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Task creation timestamp
 *           example: "2025-08-02T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2025-08-02T13:00:00Z"
 */
export interface TaskDocument extends Document {
  taskCode: string;
  title: string;
  description: string | null;
  project: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
  status: TaskStatusEnumType;
  priority: TaskPriorityEnumType;
  assignedTo: mongoose.Types.ObjectId | null;
  createdBy: mongoose.Types.ObjectId;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
  {
    taskCode: {
      type: String,
      unique: true,
      default: generateTaskCode,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatusEnum),
      default: TaskStatusEnum.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriorityEnum),
      default: TaskPriorityEnum.MEDIUM,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model<TaskDocument>("Task", taskSchema);

export default TaskModel;
