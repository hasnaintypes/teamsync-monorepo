import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/database.config";
import RoleModel, { RoleDocument } from "../models/role.model";
import { RolePermissions } from "../utils/role-permission";
import { Roles } from "../enums/role.enum";

export const seedRoles = async (
  session?: mongoose.ClientSession
): Promise<{ [key: string]: RoleDocument }> => {
  console.log("🔐 Seeding roles...");

  const createdRoles: { [key: string]: RoleDocument } = {};

  for (const roleName in RolePermissions) {
    const role = roleName as keyof typeof RolePermissions;
    const permissions = RolePermissions[role];

    const newRole = new RoleModel({
      name: role,
      permissions: permissions,
    });

    const savedRole = await newRole.save({ session });
    createdRoles[role] = savedRole;
    console.log(
      `   ✅ Role ${role} created with ${permissions.length} permissions`
    );
  }

  return createdRoles;
};

// For standalone execution
const runStandalone = async () => {
  console.log("🔐 Starting standalone role seeder...");

  try {
    await connectDatabase();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      console.log("🗑️  Clearing existing roles...");
      await RoleModel.deleteMany({}, { session });

      await seedRoles(session);
      await session.commitTransaction();
      console.log("✅ Roles seeded successfully!");
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("❌ Error during role seeding:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Only run standalone if this file is executed directly
if (require.main === module) {
  runStandalone().catch((error) =>
    console.error("❌ Error running standalone role seed script:", error)
  );
}
