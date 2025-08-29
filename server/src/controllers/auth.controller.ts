import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTP_STATUS } from "../config/http.config";
import { registerUserService } from "../services/auth.service";
import { setAuthCookies, clearAuthCookies } from "../utils/jwt";
import passport from "passport";

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the callback after Google OAuth login. Redirects the user to their workspace if successful, or to a failure URL if not.
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirect to workspace or failure URL
 *     security: []
 *
 */

/**
 * Handles the callback after Google OAuth login.
 * Sets both session and JWT cookies for hybrid authentication.
 * Redirects the user to their workspace if successful, or to a failure URL if not.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const currentWorkspace = user?.currentWorkspace;

    if (!currentWorkspace || !user) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    // Set JWT cookies for hybrid authentication
    setAuthCookies(res, {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    // Extract workspace ID properly (handle both object and string cases)
    const workspaceId = typeof currentWorkspace === 'object' 
      ? currentWorkspace._id || currentWorkspace.id 
      : currentWorkspace;

    return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${workspaceId}`
    );
  }
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Validates the request body, creates a new user, and returns a success message.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *
 */

/**
 * Handles user registration.
 * Validates the request body, creates a new user, and returns a success message.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with success message
 */
export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    await registerUserService({
      email: body.email,
      name: body.name,
      password: body.password,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      message: "User created successfully",
    });
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates the user and returns user data if successful.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *
 */

/**
 * Handles user login using Passport local strategy.
 * Sets both session and JWT cookies for hybrid authentication.
 * Authenticates the user and returns user data if successful.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<Response>} The response with user data or error message
 */
export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined
      ) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: info?.message || "Invalid email or password",
          });
        }

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }

          // Set JWT cookies for hybrid authentication
          const userObj = user as any;
          setAuthCookies(res, {
            id: userObj._id.toString(),
            email: userObj.email,
            role: userObj.role
          });

          return res.status(HTTP_STATUS.OK).json({
            message: "Logged in successfully",
            user,
          });
        });
      }
    )(req, res, next);
  }
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the user, destroys the session, and returns a success or error message.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       500:
 *         description: Failed to log out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to log out
 */

/**
 * Handles user logout.
 * Clears both session and JWT cookies for hybrid authentication.
 * Simple approach: clear cookies and destroy session safely.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} The response with logout status
 */
export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    // Clear JWT cookies immediately
    clearAuthCookies(res);

    // Handle session cleanup safely
    if (req.session) {
      // Destroy session directly without passport logout
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          // Don't return error - cookies are already cleared
        }
      });
    }

    // Clear the passport user
    if (req.user) {
      req.user = undefined;
    }

    return res
      .status(HTTP_STATUS.OK)
      .json({ message: "Logged out successfully" });
  }
);
