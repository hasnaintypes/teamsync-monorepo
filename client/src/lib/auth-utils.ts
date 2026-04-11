/**
 * @file auth-utils.ts
 * @summary Client-side authentication utilities for hybrid session/JWT authentication.
 */

/**
 * Gets a cookie value by name.
 *
 * @param {string} name - The cookie name
 * @returns {string | null} Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
};

/**
 * Clears all authentication cookies (for logout).
 */
export const clearAuthCookies = (): void => {
  if (typeof document === 'undefined') return;

  // Clear cookies by setting them to expire in the past
  const cookieOptions = '; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

  document.cookie = `auth_token=${cookieOptions}`;
  document.cookie = `auth_user=${cookieOptions}`;
  document.cookie = `session_id=${cookieOptions}`;
};

/**
 * Auto-logout function that clears cookies and redirects to login.
 * Call this when you receive 401 responses from the API.
 */
export const autoLogout = (): void => {
  clearAuthCookies();

  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};
