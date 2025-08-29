import mongoose from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";
import AccountModel from "../models/account.model";
import { ProviderEnum } from "../enums/auth-provider.enum";

export const seedUsers = async (
  session?: mongoose.ClientSession
): Promise<UserDocument[]> => {
  console.log("👥 Seeding users...");

  const userData = [
    // Owner (1)
    {
      name: "Alex Thompson",
      email: "alex.thompson@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "OWNER",
    },

    // Admins (6)
    {
      name: "Sarah Chen",
      email: "sarah.chen@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "ADMIN",
    },
    {
      name: "Michael Rodriguez",
      email: "michael.rodriguez@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "ADMIN",
    },
    {
      name: "Emily Watson",
      email: "emily.watson@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "ADMIN",
    },
    {
      name: "David Kim",
      email: "david.kim@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "ADMIN",
    },
    {
      name: "Lisa Anderson",
      email: "lisa.anderson@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "ADMIN",
    },
    {
      name: "James Wilson",
      email: "james.wilson@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "ADMIN",
    },

    // Members (13)
    {
      name: "Rachel Green",
      email: "rachel.green@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
    {
      name: "John Smith",
      email: "john.smith@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
    {
      name: "Maria Garcia",
      email: "maria.garcia@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
    {
      name: "Robert Johnson",
      email: "robert.johnson@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
    {
      name: "Jennifer Brown",
      email: "jennifer.brown@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
    {
      name: "William Davis",
      email: "william.davis@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
    {
      name: "Jessica Miller",
      email: "jessica.miller@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
    {
      name: "Christopher Taylor",
      email: "christopher.taylor@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
    {
      name: "Ashley Martinez",
      email: "ashley.martinez@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
    {
      name: "Daniel Jackson",
      email: "daniel.jackson@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
    {
      name: "Amanda White",
      email: "amanda.white@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
    {
      name: "Matthew Harris",
      email: "matthew.harris@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
    {
      name: "Stephanie Clark",
      email: "stephanie.clark@teamsync.dev",
      password: "password123",
      isActive: true,
      role: "MEMBER",
    },
  ];

  const createdUsers: UserDocument[] = [];

  for (const user of userData) {
    const newUser = new UserModel({
      name: user.name,
      email: user.email,
      password: user.password,
      isActive: user.isActive,
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name.replace(
        " ",
        ""
      )}`,
      lastLogin: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ), // Random last login within 30 days
    });

    const savedUser = await newUser.save({ session });

    // Create corresponding Account record for email authentication
    const newAccount = new AccountModel({
      provider: ProviderEnum.EMAIL,
      providerId: user.email,
      userId: savedUser._id,
      refreshToken: null,
      tokenExpiry: null,
    });

    await newAccount.save({ session });

    createdUsers.push(savedUser);
    console.log(
      `   ✅ User ${user.name} (${user.role}) created with email account`
    );
  }

  return createdUsers;
};
