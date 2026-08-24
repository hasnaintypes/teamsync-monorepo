import mongoose from "mongoose";
import ProjectModel, { ProjectDocument } from "../models/project.model";
import { WorkspaceDocument } from "../models/workspace.model";
import { UserDocument } from "../models/user.model";

export const seedProjects = async (
  session: mongoose.ClientSession,
  workspaces: WorkspaceDocument[],
  users: UserDocument[]
): Promise<ProjectDocument[]> => {
  console.log("📁 Seeding projects...");

  const createdProjects: ProjectDocument[] = [];

  // Projects for each workspace
  const projectsData = [
    // Design Studio projects
    {
      workspaceIndex: 0,
      projects: [
        {
          name: "Brand Identity Redesign",
          description:
            "Complete brand identity overhaul including logo, color palette, and typography guidelines",
          emoji: "🎨",
          createdBy: 1, // Sarah Chen (Admin)
        },
        {
          name: "Mobile App UI Kit",
          description:
            "Comprehensive UI component library for mobile applications",
          emoji: "📱",
          createdBy: 7, // Rachel Green (Member)
        },
        {
          name: "Website Redesign",
          description:
            "Modern responsive website redesign with improved user experience",
          emoji: "🌐",
          createdBy: 2, // Michael Rodriguez (Admin)
        },
      ],
    },

    // Development Hub projects
    {
      workspaceIndex: 1,
      projects: [
        {
          name: "API Development",
          description:
            "RESTful API development for the main application backend",
          emoji: "⚡",
          createdBy: 3, // Emily Watson (Admin)
        },
        {
          name: "Database Migration",
          description:
            "Migration from legacy database to modern cloud infrastructure",
          emoji: "🗄️",
          createdBy: 4, // David Kim (Admin)
        },
        {
          name: "Frontend Refactoring",
          description:
            "React application refactoring for better performance and maintainability",
          emoji: "⚛️",
          createdBy: 10, // Robert Johnson (Member)
        },
        {
          name: "DevOps Pipeline",
          description:
            "CI/CD pipeline setup for automated testing and deployment",
          emoji: "🚀",
          createdBy: 11, // Jennifer Brown (Member)
        },
      ],
    },

    // Marketing Central projects
    {
      workspaceIndex: 2,
      projects: [
        {
          name: "Q3 Campaign Launch",
          description: "Multi-channel marketing campaign for Q3 product launch",
          emoji: "📢",
          createdBy: 5, // Lisa Anderson (Admin)
        },
        {
          name: "Content Strategy",
          description:
            "Content marketing strategy and editorial calendar planning",
          emoji: "📝",
          createdBy: 14, // Christopher Taylor (Member)
        },
        {
          name: "Social Media Automation",
          description:
            "Automated social media posting and engagement tracking system",
          emoji: "📱",
          createdBy: 15, // Ashley Martinez (Member)
        },
      ],
    },

    // Product Strategy projects
    {
      workspaceIndex: 3,
      projects: [
        {
          name: "User Research Study",
          description:
            "Comprehensive user research study for new feature development",
          emoji: "🔍",
          createdBy: 6, // James Wilson (Admin)
        },
        {
          name: "Product Roadmap 2025",
          description:
            "Strategic product roadmap planning for the upcoming year",
          emoji: "🗺️",
          createdBy: 17, // Amanda White (Member)
        },
      ],
    },
  ];

  for (const workspaceProjects of projectsData) {
    const workspace = workspaces[workspaceProjects.workspaceIndex];

    for (const projectData of workspaceProjects.projects) {
      const newProject = new ProjectModel({
        name: projectData.name,
        description: projectData.description,
        emoji: projectData.emoji,
        workspace: workspace._id,
        createdBy: users[projectData.createdBy]._id,
      });

      const savedProject = await newProject.save({ session });
      createdProjects.push(savedProject);
      console.log(
        `   ✅ Project "${projectData.name}" created in "${workspace.name}"`
      );
    }
  }

  console.log(`   📊 Total projects created: ${createdProjects.length}`);
  return createdProjects;
};
