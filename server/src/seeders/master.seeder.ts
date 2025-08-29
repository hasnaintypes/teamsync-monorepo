import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/database.config";
import { seedRoles } from "./role.seeder";
import { seedUsers } from "./user.seeder";
import { seedWorkspaces } from "./workspace.seeder";
import { seedMembers } from "./member.seeder";
import { seedProjects } from "./project.seeder";
import { seedTasks } from "./task.seeder";

// Import all models to clear them
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import MemberModel from "../models/member.model";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import RoleModel from "../models/role.model";
import AccountModel from "../models/account.model";

const clearAllData = async (session: mongoose.ClientSession) => {
  console.log("🗑️  Clearing all existing data...");

  // Clear in reverse dependency order
  await TaskModel.deleteMany({}, { session });
  console.log("   ✅ Tasks cleared");

  await ProjectModel.deleteMany({}, { session });
  console.log("   ✅ Projects cleared");

  await MemberModel.deleteMany({}, { session });
  console.log("   ✅ Members cleared");

  await WorkspaceModel.deleteMany({}, { session });
  console.log("   ✅ Workspaces cleared");

  await AccountModel.deleteMany({}, { session });
  console.log("   ✅ Accounts cleared");

  await UserModel.deleteMany({}, { session });
  console.log("   ✅ Users cleared");

  await RoleModel.deleteMany({}, { session });
  console.log("   ✅ Roles cleared");

  console.log("🗑️  All data cleared successfully!\n");
};
const runMasterSeeder = async () => {
  console.log("🌱 Starting Master Seeder...\n");

  try {
    await connectDatabase();
    console.log("📡 Database connected successfully!\n");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Clear all existing data
      await clearAllData(session);

      // Seed data in dependency order
      console.log("🌱 Starting seeding process...\n");

      const roles = await seedRoles(session);
      console.log("1️⃣  Roles seeded successfully!\n");

      const users = await seedUsers(session);
      console.log("2️⃣  Users seeded successfully!\n");

      const workspaces = await seedWorkspaces(session, users, roles);
      console.log("3️⃣  Workspaces seeded successfully!\n");

      const members = await seedMembers(session, users, workspaces, roles);
      console.log("4️⃣  Members seeded successfully!\n");

      const projects = await seedProjects(session, workspaces, users);
      console.log("5️⃣  Projects seeded successfully!\n");

      const tasks = await seedTasks(session, projects, workspaces, users);
      console.log("6️⃣  Tasks seeded successfully!\n");

      await session.commitTransaction();
      console.log("✅ Transaction committed successfully!");
    } catch (error) {
      await session.abortTransaction();
      console.error("❌ Transaction aborted due to error:", error);
      throw error;
    } finally {
      await session.endSession();
      console.log("📝 Session ended.");
    }

    console.log("\n🎉 Master seeding completed successfully!");
    console.log("📊 Summary:");
    console.log("   - 3 Roles");
    console.log("   - 20 Users (1 Owner, 6 Admins, 13 Members)");
    console.log("   - 4 Workspaces");
    console.log("   - 20 Members across workspaces");
    console.log("   - 12 Projects");
    console.log("   - 50 Tasks");
  } catch (error) {
    console.error("❌ Error during master seeding:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database disconnected.");
    process.exit(0);
  }
};

runMasterSeeder().catch((error) => {
  console.error("❌ Error running master seed script:", error);
  process.exit(1);
});
