# TeamSync

A scalable, full-stack project management and team collaboration platform.

TeamSync is a powerful monorepo solution featuring a modern React frontend and a robust Node.js backend, designed to provide a comprehensive platform for managing teams, workspaces, projects, and tasks.

-----

## Table of Contents

  - [About TeamSync](https://www.google.com/search?q=%23about-teamsync)
  - [Features](https://www.google.com/search?q=%23features)
  - [Technology Stack](https://www.google.com/search?q=%23technology-stack)
  - [Folder Structure](https://www.google.com/search?q=%23folder-structure)
  - [Getting Started](https://www.google.com/search?q=%23getting-started)
  - [Development Workflow](https://www.google.com/search?q=%23development-workflow)
  - [API Documentation](https://www.google.com/search?q=%23api-documentation)
  - [Deployment](https://www.google.com/search?q=%23deployment)
  - [License](https://www.google.com/search?q=%23license)
  - [Author](https://www.google.com/search?q=%23author)

-----

## About TeamSync

TeamSync is a full-stack platform engineered to streamline project management and team collaboration. It offers a complete solution for organizing teams, projects, and tasks with key features like **role-based access control** and real-time analytics, ensuring an efficient and modern user experience.

TeamSync's architecture is a monorepo that encapsulates both the client-side and server-side applications, allowing for seamless development and deployment. The codebase is fully type-safe, with comprehensive validation and clear API documentation, which enhances the developer experience.

-----

## Features

TeamSync provides a rich set of features designed to cover all aspects of team and project management.

### Authentication & Authorization

  - **Session-based authentication**: Secure access with flexible session management.
  - **Role-based access control**: Define and manage user permissions based on roles.
  - **Permission-based UI rendering**: Dynamically display UI elements based on user permissions.

### Workspace & Member Management

  - **Workspace management**: Create, update, and organize workspaces to match your team's structure.
  - **Member management**: Invite and manage new members with assigned roles and permissions.

### Project & Task Management

  - **Project management**: Full CRUD (Create, Read, Update, Delete) operations for projects.
  - **Task workflow**: A customizable task status workflow with clear stages: Backlog, To Do, In Progress, In Review, and Done.
  - **Priority levels**: Assign priority levels to tasks for effective prioritization.

### Developer Experience

  - **Type safety**: The entire codebase is built with TypeScript for a robust and reliable application.
  - **Schema validation**: Zod is used for comprehensive request validation on both the frontend and backend.
  - **Optimistic UI updates**: React Query ensures a fast and responsive user experience with intelligent caching.
  - **API documentation**: Swagger/OpenAPI provides a detailed and interactive guide to all API endpoints.

-----

## Technology Stack

TeamSync is built as a monorepo, leveraging a modern and powerful set of technologies for both the frontend and backend.

### Backend

  - **Node.js**: A scalable and efficient runtime environment.
  - **Express.js**: A fast and minimalist web framework for Node.js.
  - **MongoDB**: A flexible and powerful NoSQL database.
  - **Passport.js**: Authentication middleware for Node.js.
  - **Zod**: A schema validation library for a type-safe codebase.
  - **Swagger**: For generating and serving interactive API documentation.

### Frontend

  - **React**: A component-based JavaScript library for building user interfaces.
  - **TypeScript**: A superset of JavaScript that adds static typing.
  - **Vite**: A fast build tool and development server.
  - **TanStack Query**: For managing server state and data fetching.
  - **Zustand**: A small, fast, and scalable state-management solution.
  - **React Hook Form**: For performance-optimized form management.
  - **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
  - **Radix UI** & **shadcn/ui**: For accessible, high-quality UI components.
  - **Axios**: A promise-based HTTP client for API requests.

-----

## Folder Structure

The monorepo is divided into two primary directories, `client` and `server`, each with its own structured architecture.

```
.
├── client/                      # Frontend application
│   ├── public/                  # Public assets
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility functions and configurations
│   │   ├── pages/               # Main application pages
│   │   ├── services/            # API services
│   │   └── types/               # TypeScript type definitions
│   └── vite.config.ts
│
├── server/                      # Backend application
│   ├── src/
│   │   ├── controllers/         # API endpoint handlers
│   │   ├── models/              # Mongoose database models
│   │   ├── routes/              # Express route definitions
│   │   ├── services/            # Business logic and data access
│   │   ├── middleware/          # Custom Express middleware
│   │   ├── config/              # Application and database configuration
│   │   └── validation/          # Zod validation schemas
│   └── tsconfig.json
│
├── .gitignore
├── CONTRIBUTION.md
├── README.md
└── ...
```

-----

## Getting Started

To get a local copy of TeamSync running, follow these steps.

### Prerequisites

Make sure you have the following installed on your machine:

  - Node.js v18 or higher
  - npm or yarn
  - A MongoDB instance (local or hosted with MongoDB Atlas)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/hasnaintype/teamsync-server.git
    cd teamsync-server
    ```
2.  Configure environment variables for both the client and server.
      - Navigate to the `client` and `server` directories.
      - In each directory, copy `.env.example` to a new file named `.env`.
      - Fill in the required values for your MongoDB URI, API base URL, and session secret.

-----

## Development Workflow

To start developing on TeamSync, you will need to run both the client and server applications.

### Backend (`server`)

Navigate to the `server` directory to manage the backend.

```bash
cd server
npm install
```

Start the development server with live reload:

```bash
npm run dev
```

### Frontend (`client`)

Navigate to the `client` directory to manage the frontend.

```bash
cd client
npm install
```

Start the Vite development server:

```bash
npm run dev
```

-----

## API Documentation

The API documentation is generated using Swagger/OpenAPI, providing a detailed and interactive guide for all available endpoints.

  - **Development**: Access the documentation at `http://localhost:5000/api/docs`.
  - **Production**: The documentation is available at `https://your-app-name.railway.app/api/docs`.

-----

## Deployment

Both the client and server are configured for seamless deployment.

  - **Backend**: The backend is configured for deployment on **Railway**. Refer to the `DEPLOYMENT.md` file in the `server` directory for detailed instructions.
  - **Frontend**: The frontend is a static site and can be deployed to any static hosting provider like **Vercel** or **Netlify**.

-----

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

-----

## Author

**Hasnain**

A passionate full-stack developer specializing in building scalable and modern web applications.

  - [GitHub](https://github.com/hasnaintype)
  - [LinkedIn](https://linkedin.com/in/hasnainx)