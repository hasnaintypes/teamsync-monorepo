import mongoose from "mongoose";
import TaskModel, { TaskDocument } from "../models/task.model";
import { ProjectDocument } from "../models/project.model";
import { WorkspaceDocument } from "../models/workspace.model";
import { UserDocument } from "../models/user.model";
import { TaskStatusEnum, TaskPriorityEnum } from "../enums/task.enum";

export const seedTasks = async (
  session: mongoose.ClientSession,
  projects: ProjectDocument[],
  workspaces: WorkspaceDocument[],
  users: UserDocument[]
): Promise<TaskDocument[]> => {
  console.log("✅ Seeding tasks...");

  const createdTasks: TaskDocument[] = [];

  // Define tasks for each project
  const tasksData = [
    // Brand Identity Redesign project (index 0)
    {
      projectIndex: 0,
      tasks: [
        {
          title: "Research competitor brands",
          description:
            "Analyze competitor brand identities and market positioning",
          status: "DONE",
          priority: "HIGH",
          assignedTo: 7, // Rachel Green
          createdBy: 1, // Sarah Chen
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        },
        {
          title: "Create logo concepts",
          description:
            "Design initial logo concepts based on research findings",
          status: "IN_PROGRESS",
          priority: "HIGH",
          assignedTo: 8, // John Smith
          createdBy: 1, // Sarah Chen
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        },
        {
          title: "Define color palette",
          description: "Establish primary and secondary color schemes",
          status: "TODO",
          priority: "MEDIUM",
          assignedTo: 9, // Maria Garcia
          createdBy: 2, // Michael Rodriguez
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
        {
          title: "Typography selection",
          description:
            "Choose primary and secondary typefaces for brand guidelines",
          status: "BACKLOG",
          priority: "MEDIUM",
          assignedTo: 7, // Rachel Green
          createdBy: 1, // Sarah Chen
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        },
      ],
    },

    // Mobile App UI Kit project (index 1)
    {
      projectIndex: 1,
      tasks: [
        {
          title: "Button component design",
          description:
            "Design various button states and sizes for mobile interface",
          status: "DONE",
          priority: "HIGH",
          assignedTo: 8, // John Smith
          createdBy: 7, // Rachel Green
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
          title: "Input field components",
          description: "Create text input, dropdown, and form field components",
          status: "IN_REVIEW",
          priority: "HIGH",
          assignedTo: 9, // Maria Garcia
          createdBy: 7, // Rachel Green
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        },
        {
          title: "Navigation components",
          description: "Design tab bars, navigation bars, and menu components",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          assignedTo: 8, // John Smith
          createdBy: 2, // Michael Rodriguez
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        },
      ],
    },

    // Website Redesign project (index 2)
    {
      projectIndex: 2,
      tasks: [
        {
          title: "Homepage wireframes",
          description: "Create low-fidelity wireframes for homepage layout",
          status: "DONE",
          priority: "HIGH",
          assignedTo: 9, // Maria Garcia
          createdBy: 2, // Michael Rodriguez
          dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
        {
          title: "Responsive design mockups",
          description:
            "Create high-fidelity mockups for desktop, tablet, and mobile",
          status: "IN_PROGRESS",
          priority: "HIGH",
          assignedTo: 7, // Rachel Green
          createdBy: 1, // Sarah Chen
          dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        },
        {
          title: "User testing plan",
          description: "Design user testing scenarios for new website layout",
          status: "TODO",
          priority: "MEDIUM",
          assignedTo: 8, // John Smith
          createdBy: 2, // Michael Rodriguez
          dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
        },
      ],
    },

    // API Development project (index 3)
    {
      projectIndex: 3,
      tasks: [
        {
          title: "Authentication endpoints",
          description:
            "Implement user login, logout, and registration API endpoints",
          status: "DONE",
          priority: "HIGH",
          assignedTo: 10, // Robert Johnson
          createdBy: 3, // Emily Watson
          dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        },
        {
          title: "User management API",
          description: "Create CRUD operations for user profile management",
          status: "IN_PROGRESS",
          priority: "HIGH",
          assignedTo: 11, // Jennifer Brown
          createdBy: 4, // David Kim
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        },
        {
          title: "Data validation middleware",
          description:
            "Implement request validation and error handling middleware",
          status: "IN_REVIEW",
          priority: "MEDIUM",
          assignedTo: 12, // William Davis
          createdBy: 3, // Emily Watson
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        },
        {
          title: "API documentation",
          description: "Create comprehensive API documentation using Swagger",
          status: "TODO",
          priority: "LOW",
          assignedTo: 13, // Jessica Miller
          createdBy: 4, // David Kim
          dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        },
      ],
    },

    // Database Migration project (index 4)
    {
      projectIndex: 4,
      tasks: [
        {
          title: "Schema analysis",
          description:
            "Analyze current database schema and identify migration requirements",
          status: "DONE",
          priority: "HIGH",
          assignedTo: 11, // Jennifer Brown
          createdBy: 4, // David Kim
          dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        },
        {
          title: "Migration scripts",
          description: "Write database migration scripts for data transfer",
          status: "IN_PROGRESS",
          priority: "HIGH",
          assignedTo: 10, // Robert Johnson
          createdBy: 3, // Emily Watson
          dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        },
        {
          title: "Data backup strategy",
          description: "Implement comprehensive backup and rollback procedures",
          status: "TODO",
          priority: "HIGH",
          assignedTo: 12, // William Davis
          createdBy: 4, // David Kim
          dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
        },
      ],
    },

    // Frontend Refactoring project (index 5)
    {
      projectIndex: 5,
      tasks: [
        {
          title: "Component audit",
          description:
            "Audit existing React components for refactoring opportunities",
          status: "DONE",
          priority: "MEDIUM",
          assignedTo: 13, // Jessica Miller
          createdBy: 10, // Robert Johnson
          dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        },
        {
          title: "State management refactor",
          description:
            "Migrate from Redux to React Context for state management",
          status: "IN_PROGRESS",
          priority: "HIGH",
          assignedTo: 12, // William Davis
          createdBy: 3, // Emily Watson
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
        {
          title: "Performance optimization",
          description:
            "Implement lazy loading and code splitting for better performance",
          status: "TODO",
          priority: "MEDIUM",
          assignedTo: 11, // Jennifer Brown
          createdBy: 10, // Robert Johnson
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        },
      ],
    },

    // DevOps Pipeline project (index 6)
    {
      projectIndex: 6,
      tasks: [
        {
          title: "GitHub Actions setup",
          description:
            "Configure GitHub Actions workflows for automated testing",
          status: "DONE",
          priority: "HIGH",
          assignedTo: 12, // William Davis
          createdBy: 11, // Jennifer Brown
          dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        },
        {
          title: "Docker containerization",
          description:
            "Containerize application using Docker for consistent deployments",
          status: "IN_PROGRESS",
          priority: "HIGH",
          assignedTo: 10, // Robert Johnson
          createdBy: 4, // David Kim
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        },
        {
          title: "Deployment automation",
          description:
            "Set up automated deployment to staging and production environments",
          status: "TODO",
          priority: "MEDIUM",
          assignedTo: 13, // Jessica Miller
          createdBy: 11, // Jennifer Brown
          dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
        },
      ],
    },

    // Q3 Campaign Launch project (index 7)
    {
      projectIndex: 7,
      tasks: [
        {
          title: "Campaign strategy document",
          description:
            "Create comprehensive campaign strategy and messaging framework",
          status: "DONE",
          priority: "HIGH",
          assignedTo: 14, // Christopher Taylor
          createdBy: 5, // Lisa Anderson
          dueDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        },
        {
          title: "Creative asset development",
          description:
            "Design banners, social media graphics, and promotional materials",
          status: "IN_PROGRESS",
          priority: "HIGH",
          assignedTo: 15, // Ashley Martinez
          createdBy: 5, // Lisa Anderson
          dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        },
        {
          title: "Email campaign setup",
          description:
            "Configure email marketing automation and subscriber segmentation",
          status: "TODO",
          priority: "MEDIUM",
          assignedTo: 16, // Daniel Jackson
          createdBy: 14, // Christopher Taylor
          dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
        },
      ],
    },

    // Content Strategy project (index 8)
    {
      projectIndex: 8,
      tasks: [
        {
          title: "Content audit",
          description:
            "Audit existing content and identify gaps in content strategy",
          status: "DONE",
          priority: "MEDIUM",
          assignedTo: 15, // Ashley Martinez
          createdBy: 14, // Christopher Taylor
          dueDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
        },
        {
          title: "Editorial calendar",
          description:
            "Create Q4 editorial calendar with content themes and deadlines",
          status: "IN_PROGRESS",
          priority: "HIGH",
          assignedTo: 16, // Daniel Jackson
          createdBy: 5, // Lisa Anderson
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        },
        {
          title: "Content templates",
          description:
            "Develop standardized templates for blog posts and social media",
          status: "TODO",
          priority: "LOW",
          assignedTo: 14, // Christopher Taylor
          createdBy: 15, // Ashley Martinez
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        },
      ],
    },

    // Social Media Automation project (index 9)
    {
      projectIndex: 9,
      tasks: [
        {
          title: "Platform integration",
          description: "Integrate with Twitter, LinkedIn, and Instagram APIs",
          status: "IN_PROGRESS",
          priority: "HIGH",
          assignedTo: 16, // Daniel Jackson
          createdBy: 15, // Ashley Martinez
          dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        },
        {
          title: "Scheduling interface",
          description:
            "Build user interface for content scheduling and management",
          status: "TODO",
          priority: "MEDIUM",
          assignedTo: 14, // Christopher Taylor
          createdBy: 5, // Lisa Anderson
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        },
        {
          title: "Analytics dashboard",
          description:
            "Create dashboard for tracking engagement and performance metrics",
          status: "BACKLOG",
          priority: "LOW",
          assignedTo: 15, // Ashley Martinez
          createdBy: 16, // Daniel Jackson
          dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        },
      ],
    },

    // User Research Study project (index 10)
    {
      projectIndex: 10,
      tasks: [
        {
          title: "Research methodology",
          description:
            "Define research questions, methodology, and success metrics",
          status: "DONE",
          priority: "HIGH",
          assignedTo: 17, // Amanda White
          createdBy: 6, // James Wilson
          dueDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), // 11 days ago
        },
        {
          title: "Participant recruitment",
          description:
            "Recruit and schedule participants for user interviews and testing",
          status: "IN_PROGRESS",
          priority: "HIGH",
          assignedTo: 18, // Matthew Harris
          createdBy: 17, // Amanda White
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        },
        {
          title: "Interview guide creation",
          description:
            "Develop structured interview guides and testing scenarios",
          status: "TODO",
          priority: "MEDIUM",
          assignedTo: 19, // Stephanie Clark
          createdBy: 6, // James Wilson
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      ],
    },

    // Product Roadmap 2025 project (index 11)
    {
      projectIndex: 11,
      tasks: [
        {
          title: "Stakeholder interviews",
          description:
            "Conduct interviews with key stakeholders to gather requirements",
          status: "IN_PROGRESS",
          priority: "HIGH",
          assignedTo: 18, // Matthew Harris
          createdBy: 17, // Amanda White
          dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        },
        {
          title: "Feature prioritization",
          description:
            "Prioritize features based on user impact and development effort",
          status: "TODO",
          priority: "HIGH",
          assignedTo: 19, // Stephanie Clark
          createdBy: 6, // James Wilson
          dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
        },
        {
          title: "Roadmap visualization",
          description:
            "Create visual roadmap timeline with milestones and dependencies",
          status: "BACKLOG",
          priority: "MEDIUM",
          assignedTo: 17, // Amanda White
          createdBy: 18, // Matthew Harris
          dueDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
        },
      ],
    },
  ];

  for (const projectTasks of tasksData) {
    const project = projects[projectTasks.projectIndex];
    const projectWorkspace = workspaces.find(
      (w: WorkspaceDocument) =>
        (w._id as mongoose.Types.ObjectId).toString() ===
        project.workspace.toString()
    );

    for (const taskData of projectTasks.tasks) {
      const newTask = new TaskModel({
        title: taskData.title,
        description: taskData.description,
        project: project._id,
        workspace: project.workspace,
        status: TaskStatusEnum[taskData.status as keyof typeof TaskStatusEnum],
        priority:
          TaskPriorityEnum[taskData.priority as keyof typeof TaskPriorityEnum],
        assignedTo: users[taskData.assignedTo]._id,
        createdBy: users[taskData.createdBy]._id,
        dueDate: taskData.dueDate,
      });

      const savedTask = await newTask.save({ session });
      createdTasks.push(savedTask);
      console.log(
        `   ✅ Task "${taskData.title}" created for project "${project.name}"`
      );
    }
  }

  console.log(`   📊 Total tasks created: ${createdTasks.length}`);
  return createdTasks;
};
