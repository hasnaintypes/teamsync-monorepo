import { UserDocument } from "../models/user.model";

declare global {
  namespace Express {
    interface User extends UserDocument {
      // Typed as any to bridge Mongoose ObjectId with string params across 20+ controller callsites.
      // Changing to ObjectId or string would require .toString() in every controller.
      _id?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  }
}
