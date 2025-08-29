import bcrypt from "bcrypt";

/**
 * Utility functions for hashing and comparing values using bcrypt.
 * @module utils/bcrypt
 */

/**
 * Hash a value using bcrypt.
 * @param {string} value - The value to hash (e.g., a password).
 * @param {number} [saltRounds=10] - The number of salt rounds to use for hashing.
 * @returns {Promise<string>} The hashed value.
 */
export const hashValue = async (
  value: string,
  saltRounds: number = 10
): Promise<string> => await bcrypt.hash(value, saltRounds);

/**
 * Compare a plain value with a hashed value using bcrypt.
 * @param {string} value - The plain value to compare.
 * @param {string} hashedValue - The hashed value to compare against.
 * @returns {Promise<boolean>} True if the values match, false otherwise.
 */
export const compareValue = async (
  value: string,
  hashedValue: string
): Promise<boolean> => await bcrypt.compare(value, hashedValue);
