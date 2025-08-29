/**
 * @file routePaths.ts
 * @summary Defines route path constants and utilities for TeamSync routing.
 * @remarks
 * Contains authentication, protected, and base route definitions for use in React Router.
 */

/**
 * Checks if a given pathname matches any authentication route.
 *
 * @param {string} pathname - The current route pathname.
 * @returns {boolean} True if the pathname is an authentication route, false otherwise.
 */
export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

/**
 * Authentication route paths for sign-in, sign-up, and OAuth callback.
 */
export const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
  GOOGLE_OAUTH_CALLBACK: "/google/oauth/callback",
};

/**
 * Protected route paths for workspace, tasks, members, settings, and project details.
 */
export const PROTECTED_ROUTES = {
  WORKSPACE: "/workspace/:workspaceId",
  TASKS: "/workspace/:workspaceId/tasks",
  MEMBERS: "/workspace/:workspaceId/members",
  SETTINGS: "/workspace/:workspaceId/settings",
  PROJECT_DETAILS: "/workspace/:workspaceId/project/:projectId",
};

/**
 * Base route paths for invite URLs.
 */
export const BASE_ROUTE = {
  INVITE_URL: "/invite/workspace/:inviteCode/join",
};
