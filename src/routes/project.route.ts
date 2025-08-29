import { Router } from "express";
import {
  createProjectController,
  deleteProjectController,
  getAllProjectsInWorkspaceController,
  getProjectAnalyticsController,
  getProjectByIdAndWorkspaceIdController,
  updateProjectController,
} from "../controllers/project.controller";

const projectRoutes = Router();

// Create a new project in a workspace
projectRoutes.post("/:workspaceId/create", createProjectController);

// Update project details in a workspace
projectRoutes.put("/:workspaceId/:id/update", updateProjectController);

// Delete a project from a workspace
projectRoutes.delete("/:workspaceId/:id/delete", deleteProjectController);

// Get all projects in a workspace
projectRoutes.get("/:workspaceId/all", getAllProjectsInWorkspaceController);

// Get a project by ID in a workspace
projectRoutes.get("/:workspaceId/:id", getProjectByIdAndWorkspaceIdController);

// Get analytics for a project in a workspace
projectRoutes.get("/:workspaceId/:id/analytics", getProjectAnalyticsController);

export default projectRoutes;
