/**
 * @file axios-client.ts
 * @summary Axios client configuration for TeamSync API requests.
 * @remarks
 * Sets up base URL, credentials, timeout, and response interceptors for API calls.
 */
import axios from "axios";
import { autoLogout } from "./auth-utils";

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
    const { data, status } = error.response || {};
    
    // Log errors only in development
    if (import.meta.env.DEV) {
      console.error("API Error:", { data, status, url: error.config?.url });
    }
    
    // Handle authentication errors with hybrid system
    if (status === 401) {
      console.log("Authentication failed, performing auto-logout...");
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
