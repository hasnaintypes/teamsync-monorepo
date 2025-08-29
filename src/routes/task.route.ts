import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
} from "../controllers/task.controller";

const taskRoutes = Router();

// Create a new task in a project
taskRoutes.post(
  "/project/:projectId/workspace/:workspaceId/create",
  createTaskController
);

// Update a task in a project
taskRoutes.put(
  "/:id/project/:projectId/workspace/:workspaceId/update",
  updateTaskController
);

// Delete a task from a workspace
taskRoutes.delete("/:id/workspace/:workspaceId/delete", deleteTaskController);

// Get all tasks in a workspace
taskRoutes.get("/workspace/:workspaceId/all", getAllTasksController);

// Get a task by ID in a project and workspace
taskRoutes.get(
  "/:id/project/:projectId/workspace/:workspaceId",
  getTaskByIdController
);

export default taskRoutes;
