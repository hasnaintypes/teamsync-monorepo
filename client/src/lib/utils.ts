/**
 * @file utils.ts
 * @summary Utility function for merging class names in TeamSync client.
 * @remarks
 * Provides a helper to conditionally join and merge Tailwind CSS class names.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally join classNames and merge Tailwind classes.
 * @param {...ClassValue[]} inputs - Class values to merge.
 * @returns {string} Merged className string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
