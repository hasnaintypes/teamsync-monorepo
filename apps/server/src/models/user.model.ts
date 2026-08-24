import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

/**
 * User model interface representing a user in the system.
 * This model is used to manage user accounts and their associated data.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - isActive
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: Hashed password (never exposed in responses)
 *           example: "$2b$10$abcdefg..."
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           description: URL to the user's profile picture
 *           example: "https://example.com/avatar.jpg"
 *         isActive:
 *           type: boolean
 *           description: Whether the user is active
 *           example: true
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Last login timestamp
 *           example: "2025-08-01T10:00:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *           example: "2025-08-02T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2025-08-02T13:00:00Z"
 *         currentWorkspace:
 *           type: string
 *           format: objectId
 *           nullable: true
 *           description: Reference to the user's current workspace
 *           example: "64c8b2f2e1a2c8a1b2f2e1a3"
 */
export interface UserDocument extends Document {
  name: string;

  email: string;

  password?: string;

  profilePicture: string | null;

  isActive: boolean;

  lastLogin: Date | null;

  createdAt: Date;

  updatedAt: Date;

  currentWorkspace: mongoose.Types.ObjectId | null;

  /**
   * Compare a plain text password with the hashed password.
   * @param value - The plain text password to compare.
   * @returns Promise resolving to a boolean indicating match.
   */
  comparePassword(value: string): Promise<boolean>;

  /**
   * Return a user object with the password field removed.
   * @returns User object without the password field.
   */
  omitPassword(): Omit<UserDocument, "password">;
}

// Schema definition for the User model
const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: true, // Ensures password is only returned when explicitly selected
    },
    profilePicture: {
      type: String,
      default: null,
    },
    currentWorkspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to hash the password if it has been modified.
 */
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await hashValue(this.password);
  }
  next();
});

/**
 * Instance method to remove the password field from the returned user object.
 * Useful when returning user data in responses.
 */
userSchema.methods.omitPassword = function (): Omit<UserDocument, "password"> {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

/**
 * Instance method to compare a given password with the user's hashed password.
 * @param value - The plain text password to check.
 * @returns Promise resolving to true if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
