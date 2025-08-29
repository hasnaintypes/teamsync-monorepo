import { PermissionType, Permissions } from "../enums/role.enum";
import { UnauthorizedException } from "./app-error";
import { RolePermissions } from "./role-permission";

/**
 * Guards access to resources based on role permissions.
 * Validates that a given role has all the required permissions to perform an action.
 *
 * @param {keyof typeof RolePermissions} role - The role to check permissions for
 * @param {PermissionType[]} requiredPermissions - Array of permissions required to perform the action
 * @returns {void} Returns nothing if permissions are valid
 * @throws {UnauthorizedException} When the role lacks any of the required permissions
 *
 */
export const roleGuard = (
  role: keyof typeof RolePermissions,
  requiredPermissions: PermissionType[]
) => {
  const permissions = RolePermissions[role];
  // If the role doesn't exist or lacks required permissions, throw an exception

  const hasPermission = requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );

  if (!hasPermission) {
    throw new UnauthorizedException(
      "You do not have the necessary permissions to perform this action"
    );
  }
};
