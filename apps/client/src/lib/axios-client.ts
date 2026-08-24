/**
 * @file axios-client.ts
 * @summary Axios client configuration for TeamSync API requests.
 * @remarks
 * Sets up base URL, credentials, timeout, and response interceptors for API calls.
 */
import axios from "axios";
import { autoLogout } from "./auth-utils";
import { logger } from "./logger";

/**
 * The base URL for API requests, loaded from environment variables.
 * @type {string}
 */
const baseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * Axios client options including base URL, credentials, and timeout.
 * @type {object}
 */
const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
};

/**
 * Axios API client instance for making HTTP requests.
 * @type {import('axios').AxiosInstance}
 */
const API = axios.create(options);

/**
 * Response interceptor to handle unauthorized errors globally.
 * Uses hybrid authentication system to handle logouts automatically.
 */
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle network errors, timeouts, and other cases where no response exists
    if (!error.response) {
      return Promise.reject({
        message: error.message || "Network error",
        status: 0,
      });
    }

    const { data, status } = error.response;

    logger.error("API Error:", { data, status, url: error.config?.url });

    // Handle authentication errors with hybrid system
    if (status === 401) {
      logger.log("Authentication failed, performing auto-logout...");
      autoLogout();
      return Promise.reject({
        message: "Authentication failed. Please log in again.",
        status,
      });
    }

    return Promise.reject({
      ...data,
      status,
    });
  }
);

/**
 * Default export of the configured Axios API client.
 */
export default API;
