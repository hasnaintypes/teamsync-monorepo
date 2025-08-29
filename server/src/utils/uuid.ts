import { v4 as uuidv4 } from "uuid";

/**
 * Generate a unique invite code for workspaces.
 * @returns {string} The generated invite code.
 */
export function generateInviteCode() {
  return uuidv4().replace(/-/g, "").substring(0, 8);
}

/**
 * Generate a unique task code.
 * @returns {string} The generated task code.
 */
export function generateTaskCode() {
  return `task-${uuidv4().replace(/-/g, "").substring(0, 3)}`;
}
