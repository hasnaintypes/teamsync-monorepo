import mongoose from "mongoose";
import WorkspaceModel, { WorkspaceDocument } from "../models/workspace.model";
import { UserDocument } from "../models/user.model";
import { RoleDocument } from "../models/role.model";

export const seedWorkspaces = async (
  session: mongoose.ClientSession,
  users: UserDocument[],
  roles: { [key: string]: RoleDocument }
): Promise<WorkspaceDocument[]> => {
  console.log("🏢 Seeding workspaces...");

  // Get the owner (first user)
  const owner = users[0];

  const workspaceData = [
    {
      name: "Design Studio",
      description:
        "Creative design team workspace for UI/UX projects and brand development",
      owner: owner._id,
    },
    {
      name: "Development Hub",
      description:
        "Software development team workspace for web and mobile applications",
      owner: owner._id,
    },
    {
      name: "Marketing Central",
      description:
        "Marketing team workspace for campaigns, content creation, and analytics",
      owner: owner._id,
    },
    {
      name: "Product Strategy",
      description:
        "Product management workspace for roadmaps, feature planning, and user research",
      owner: owner._id,
    },
  ];

  const createdWorkspaces: WorkspaceDocument[] = [];

  for (const workspace of workspaceData) {
    const newWorkspace = new WorkspaceModel({
      name: workspace.name,
      description: workspace.description,
      owner: workspace.owner,
    });

    const savedWorkspace = await newWorkspace.save({ session });
    createdWorkspaces.push(savedWorkspace);
    console.log(`   ✅ Workspace "${workspace.name}" created`);
  }

  // Update owner's current workspace to the first one
  await users[0].updateOne(
    { currentWorkspace: createdWorkspaces[0]._id },
    { session }
  );

  return createdWorkspaces;
};
