import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/app-error";
import { verifyJWT } from "../utils/jwt";
import UserModel from "../models/user.model";

/**
 * Middleware to ensure user is authenticated.
 * Supports both session-based and JWT-based authentication.
 * Tries session first, then falls back to JWT token from cookies.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @throws {UnauthorizedException} When user is not authenticated
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // First, try session-based authentication
    if (req.user && req.user._id) {
      return next();
    }

    // Fallback to JWT authentication from cookies
    const token = req.cookies.auth_token;
    
    if (!token) {
      throw new UnauthorizedException("Unauthorized. Please log in.");
    }

    // Verify JWT token
    const decoded = verifyJWT(token);
    
    // Find user in database to ensure they still exist
    const user = await UserModel.findById(decoded.id).populate('memberships.workspace');
    
    if (!user) {
      throw new UnauthorizedException("User not found. Please log in again.");
    }

    // Attach user to request object (similar to passport)
    req.user = user;
    
    next();
  } catch (error) {
    // Log the specific error for debugging in production
    console.error('[Auth Middleware] Error:', {
      error: error instanceof Error ? error.message : error,
      hasToken: !!req.cookies.auth_token,
      NODE_ENV: process.env.NODE_ENV,
      userAgent: req.headers['user-agent']
    });

    if (error instanceof UnauthorizedException) {
      throw error;
    }
    
    // Clear invalid cookies with proper options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    } as const;
    
    res.clearCookie('auth_token', cookieOptions);
    res.clearCookie('auth_user', { ...cookieOptions, httpOnly: false });
    
    throw new UnauthorizedException("Invalid authentication token. Please log in again.");
  }
};

export default requireAuth;
