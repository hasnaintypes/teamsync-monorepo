import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import {
  registerUserController,
  loginController,
  logOutController,
  googleLoginCallback,
} from "../controllers/auth.controller";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();

// Register a new user
authRoutes.post("/register", registerUserController);

// Login user
authRoutes.post("/login", loginController);

// Logout user
authRoutes.post("/logout", logOutController);

// Google OAuth
authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth callback
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failedUrl,
  }),
  googleLoginCallback
);

export default authRoutes;
