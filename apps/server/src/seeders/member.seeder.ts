import mongoose from "mongoose";
import MemberModel, { MemberDocument } from "../models/member.model";
import { UserDocument } from "../models/user.model";
import { WorkspaceDocument } from "../models/workspace.model";
import { RoleDocument } from "../models/role.model";

export const seedMembers = async (
  session: mongoose.ClientSession,
  users: UserDocument[],
  workspaces: WorkspaceDocument[],
  roles: { [key: string]: RoleDocument }
): Promise<MemberDocument[]> => {
  console.log("👨‍💼 Seeding members...");

  const createdMembers: MemberDocument[] = [];

  // Define user roles (first user is owner, next 6 are admins, rest are members)
  const userRoles = [
    "OWNER", // Alex Thompson
    "ADMIN",
    "ADMIN",
    "ADMIN",
    "ADMIN",
    "ADMIN",
    "ADMIN", // Sarah Chen, Michael Rodriguez, Emily Watson, David Kim, Lisa Anderson, James Wilson
    "MEMBER",
    "MEMBER",
    "MEMBER",
    "MEMBER",
    "MEMBER",
    "MEMBER",
    "MEMBER", // Rachel Green, John Smith, Maria Garcia, Robert Johnson, Jennifer Brown, William Davis, Jessica Miller
    "MEMBER",
    "MEMBER",
    "MEMBER",
    "MEMBER",
    "MEMBER",
    "MEMBER", // Christopher Taylor, Ashley Martinez, Daniel Jackson, Amanda White, Matthew Harris, Stephanie Clark
  ];

  // Add members to workspaces
  for (
    let workspaceIndex = 0;
    workspaceIndex < workspaces.length;
    workspaceIndex++
  ) {
    const workspace = workspaces[workspaceIndex];

    // Determine which users to add to this workspace
    let usersToAdd: { user: UserDocument; role: string }[] = [];

    switch (workspaceIndex) {
      case 0: // Design Studio - 6 users
        usersToAdd = [
          { user: users[0], role: "OWNER" }, // Alex Thompson
          { user: users[1], role: "ADMIN" }, // Sarah Chen
          { user: users[2], role: "ADMIN" }, // Michael Rodriguez
          { user: users[7], role: "MEMBER" }, // Rachel Green
          { user: users[8], role: "MEMBER" }, // John Smith
          { user: users[9], role: "MEMBER" }, // Maria Garcia
        ];
        break;

      case 1: // Development Hub - 7 users
        usersToAdd = [
          { user: users[0], role: "OWNER" }, // Alex Thompson
          { user: users[3], role: "ADMIN" }, // Emily Watson
          { user: users[4], role: "ADMIN" }, // David Kim
          { user: users[10], role: "MEMBER" }, // Robert Johnson
          { user: users[11], role: "MEMBER" }, // Jennifer Brown
          { user: users[12], role: "MEMBER" }, // William Davis
          { user: users[13], role: "MEMBER" }, // Jessica Miller
        ];
        break;

      case 2: // Marketing Central - 5 users
        usersToAdd = [
          { user: users[0], role: "OWNER" }, // Alex Thompson
          { user: users[5], role: "ADMIN" }, // Lisa Anderson
          { user: users[14], role: "MEMBER" }, // Christopher Taylor
          { user: users[15], role: "MEMBER" }, // Ashley Martinez
          { user: users[16], role: "MEMBER" }, // Daniel Jackson
        ];
        break;

      case 3: // Product Strategy - 5 users
        usersToAdd = [
          { user: users[0], role: "OWNER" }, // Alex Thompson
          { user: users[6], role: "ADMIN" }, // James Wilson
          { user: users[17], role: "MEMBER" }, // Amanda White
          { user: users[18], role: "MEMBER" }, // Matthew Harris
          { user: users[19], role: "MEMBER" }, // Stephanie Clark
        ];
        break;
    }

    // Create member records
    for (const userToAdd of usersToAdd) {
      const newMember = new MemberModel({
        userId: userToAdd.user._id,
        workspaceId: workspace._id,
        role: roles[userToAdd.role]._id,
        joinedAt: new Date(
          Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
        ), // Random join date within 60 days
      });

      const savedMember = await newMember.save({ session });
      createdMembers.push(savedMember);
      console.log(
        `   ✅ ${userToAdd.user.name} added to "${workspace.name}" as ${userToAdd.role}`
      );
    }
  }

  console.log(`   📊 Total members created: ${createdMembers.length}`);
  return createdMembers;
};
