import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller";

const userRoutes = Router();

// Get current authenticated user
userRoutes.get("/current", getCurrentUserController);

export default userRoutes;
