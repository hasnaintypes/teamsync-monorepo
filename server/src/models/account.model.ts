import mongoose, { Document, Schema } from "mongoose";
import { ProviderEnum, ProviderEnumType } from "../enums/auth-provider.enum";

/**
 * Account model interface representing a user's account with an external provider.
 * This model is used to manage accounts linked to various authentication providers.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       required:
 *         - provider
 *         - providerId
 *         - userId
 *       properties:
 *         provider:
 *           type: string
 *           description: Authentication provider (e.g. google, facebook, email)
 *           example: "google"
 *         providerId:
 *           type: string
 *           description: Unique ID from the provider (email, googleId, etc.)
 *           example: "user@gmail.com"
 *         userId:
 *           type: string
 *           format: objectId
 *           description: Reference to the User
 *           example: "64c8b2f2e1a2c8a1b2f2e1a2"
 *         refreshToken:
 *           type: string
 *           nullable: true
 *           description: OAuth refresh token
 *           example: "1//0gabcdefg..."
 *         tokenExpiry:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Token expiry date
 *           example: "2025-08-02T12:34:56Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *           example: "2025-08-02T12:34:56Z"
 */
export interface AccountDocument extends Document {
  provider: ProviderEnumType;
  providerId: string; // Store the email, googleId, facebookId as the providerId
  userId: mongoose.Types.ObjectId;
  refreshToken: string | null;
  tokenExpiry: Date | null;
  createdAt: Date;
}

const accountSchema = new Schema<AccountDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      required: true,
    },
    providerId: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: { type: String, default: null },
    tokenExpiry: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.refreshToken;
      },
    },
  }
);

const AccountModel = mongoose.model<AccountDocument>("Account", accountSchema);
export default AccountModel;
