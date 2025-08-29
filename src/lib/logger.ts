/**
 * @file logger.ts
 * @summary Development-only logging utility.
 * @remarks
 * Provides conditional logging that only works in development environment.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (message?: unknown, ...optionalParams: unknown[]) => {
    if (isDev) {
      console.log(message, ...optionalParams);
    }
  },
  error: (message?: unknown, ...optionalParams: unknown[]) => {
    if (isDev) {
      console.error(message, ...optionalParams);
    }
  },
  warn: (message?: unknown, ...optionalParams: unknown[]) => {
    if (isDev) {
      console.warn(message, ...optionalParams);
    }
  },
  info: (message?: unknown, ...optionalParams: unknown[]) => {
    if (isDev) {
      console.info(message, ...optionalParams);
    }
  },
  debug: (message?: unknown, ...optionalParams: unknown[]) => {
    if (isDev) {
      console.debug(message, ...optionalParams);
    }
  },
};

export default logger;
