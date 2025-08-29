/**
/**
 * @file base-url.ts
 * @summary Exports the base API URL for TeamSync client.
 * @remarks
 * Loads the base URL from environment variables for use in API requests.
 */
/**
 * The base URL for API requests, loaded from environment variables.
 * @type {string}
 */
export const baseURL = import.meta.env.VITE_API_BASE_URL;
