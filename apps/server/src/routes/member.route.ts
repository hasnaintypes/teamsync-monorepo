import { Router } from "express";
import { joinWorkspaceController } from "../controllers/member.controller";

const memberRoutes = Router();

// Join a workspace by invite code
memberRoutes.post("/workspace/:inviteCode/join", joinWorkspaceController);

export default memberRoutes;
