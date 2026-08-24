import { Router } from "express";
import {
  createWorkspaceController,
  updateWorkspaceByIdController,
  deleteWorkspaceByIdController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceByIdController,
  getWorkspaceMembersController,
  getWorkspaceAnalyticsController,
  changeWorkspaceMemberRoleController,
} from "../controllers/workspace.controller";

const workspaceRoutes = Router();

// Create a new workspace
workspaceRoutes.post("/create/new", createWorkspaceController);

// Update workspace details
workspaceRoutes.put("/update/:id", updateWorkspaceByIdController);

// Delete a workspace
workspaceRoutes.delete("/delete/:id", deleteWorkspaceByIdController);

// Get all workspaces for the user
workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);

// Get workspace by ID
workspaceRoutes.get("/:id", getWorkspaceByIdController);

// Get members of a workspace
workspaceRoutes.get("/members/:id", getWorkspaceMembersController);

// Get analytics for a workspace
workspaceRoutes.get("/analytics/:id", getWorkspaceAnalyticsController);

// Change member role in a workspace
workspaceRoutes.put(
  "/change/member/role/:id",
  changeWorkspaceMemberRoleController
);

export default workspaceRoutes;
