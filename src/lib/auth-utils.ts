/**
 * @file auth-utils.ts
 * @summary Client-side authentication utilities for hybrid session/JWT authentication.
 */

/**
 * Gets the current authenticated user from the auth_user cookie.
 * This is a non-httpOnly cookie that contains user information.
 * 
 * @returns {object | null} User object or null if not authenticated
 */
export const getAuthUser = (): {
  id: string;
  email: string;
  role?: string;
} | null => {
  try {
    const authUser = getCookie('auth_user');
    if (!authUser) return null;
    
    return JSON.parse(decodeURIComponent(authUser));
  } catch (error) {
    console.error('Error parsing auth user cookie:', error);
    return null;
  }
};

/**
 * Checks if the user is authenticated by checking for the auth_token cookie.
 * 
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  const authToken = getCookie('auth_token');
  const authUser = getAuthUser();
  
  return !!(authToken && authUser);
};

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
