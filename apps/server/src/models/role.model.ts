import mongoose, { Schema, Document } from "mongoose";
import {
  Permissions,
  PermissionType,
  Roles,
  RoleType,
} from "../enums/role.enum";
import { RolePermissions } from "../utils/role-permission";

/**
 * Role model interface representing a user's role in the system.
 * This model is used to manage roles and their associated permissions.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *         - permissions
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the role
 *           example: "admin"
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: List of permissions assigned to the role
 *           example: ["read", "write", "delete"]
 */
export interface RoleDocument extends Document {
  name: RoleType;
  permissions: Array<PermissionType>;
}

const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      enum: Object.values(Roles),
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(Permissions),
      required: true,
      default: function (this: RoleDocument) {
        return RolePermissions[this.name];
      },
    },
  },
  {
    timestamps: true,
  }
);

const RoleModel = mongoose.model<RoleDocument>("Role", roleSchema);
export default RoleModel;
