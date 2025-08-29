/**
 * Utility function to get environment variables with a default value fallback.
 * @param {string} key - The name of the environment variable.
 * @param {string} [defaultValue=""] - The default value to return if the environment variable is not set.
 * @returns {string} The value of the environment variable or the default value.
 * @throws {Error} If the environment variable is not set and no default value is provided.
 */
export const getEnv = (key: string, defaultValue: string = ""): string => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue) {
      return defaultValue;
    }
    console.error(`[Env] Environment variable ${key} is not set`);
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};
