import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../config/http.config";

/**
 * CSRF protection middleware using custom header validation.
 *
 * Requires an `X-Requested-With: XMLHttpRequest` header on all state-changing
 * requests (POST, PUT, DELETE, PATCH). Browsers will not send custom headers
 * on cross-origin requests without a CORS preflight, and the existing CORS
 * policy restricts allowed origins — so only the legitimate frontend can pass.
 *
 * OAuth callback routes are exempted because they are browser redirects,
 * not AJAX requests.
 */
const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Skip CSRF check for OAuth callback routes (browser redirects)
  if (req.path.includes("/auth/google/callback")) {
    return next();
  }

  const xRequestedWith = req.headers["x-requested-with"];
  if (xRequestedWith === "XMLHttpRequest") {
    return next();
  }

  res.status(HTTP_STATUS.FORBIDDEN).json({
    message: "Forbidden: missing or invalid X-Requested-With header",
  });
};

export default csrfProtection;
