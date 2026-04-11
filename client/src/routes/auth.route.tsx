/**
 * @file auth.route.tsx
 * @summary Route guard for authentication-related pages in TeamSync.
 * @remarks
 * Renders child routes for authentication flows (sign-in, sign-up, etc.).
 */
import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import { useAppContext } from "@/context/app-provider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthRoute } from "./common/routePaths";
import { logger } from "@/lib/logger";

/**
 * AuthRoute component renders authentication-related child routes.
 *
 * @returns {JSX.Element} The nested authentication routes.
 */

const AuthRoute = () => {
  const location = useLocation();
  const { user, isLoading } = useAppContext();

  const _isAuthRoute = isAuthRoute(location.pathname);

  if (isLoading && !_isAuthRoute) return <DashboardSkeleton />;

  if (!user) return <Outlet />;

  const workspaceId = user.currentWorkspace?._id;

  if (!workspaceId) {
    logger.error("AuthRoute - No workspace ID found, redirecting to workspace creation");
    return <Navigate to="/workspace/create" replace />;
  }

  return <Navigate to={`/workspace/${workspaceId}`} replace />;
};

export default AuthRoute;
