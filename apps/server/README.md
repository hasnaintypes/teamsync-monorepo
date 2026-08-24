# team-sync-server

## Overview

team-sync-server is a robust, scalable backend API for team and project management, built with Node.js, Express, and MongoDB. It provides comprehensive features for authentication, workspace management, member roles, projects, and tasks, with strong documentation and testing support.

## Features

- **Authentication**: Local and Google OAuth, session-based authentication, secure password handling
- **User Management**: Registration, login, logout, user info endpoints
- **Workspace Management**: Create, update, delete workspaces; manage workspace members and roles
- **Project Management**: CRUD operations for projects within workspaces
- **Task Management**: CRUD operations for tasks within projects and workspaces, with filtering and pagination
- **Role & Permission System**: Fine-grained access control for all major resources
- **Validation**: Zod-based request validation for all endpoints
- **Error Handling**: Centralized error handling with custom exceptions
- **API Documentation**: Integrated Swagger/OpenAPI docs for all endpoints
- **Testing Support**: Postman collection for API testing

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- Passport.js (local & Google OAuth)
- Zod (validation)
- Swagger/OpenAPI (API docs)
- JSDoc (code documentation)
- Postman (API testing)

## Getting Started

> **Note:** This package lives at `apps/server` inside the [teamsync-monorepo](https://github.com/hasnaintypes/teamsync-monorepo) Turborepo workspace. Dependencies are installed once from the repository root via `pnpm install`; this README documents commands that can be run either from the repo root (using `pnpm --filter team-sync-server <script>` or `pnpm turbo run <script> --filter=team-sync-server`) or from within `apps/server` directly.

### Prerequisites

- Node.js >= 20.x (see root `.nvmrc`)
- [pnpm](https://pnpm.io/) >= 10.x
- MongoDB instance (local or MongoDB Atlas)

### Local Development

1. Clone the monorepo:
   ```sh
   git clone https://github.com/hasnaintypes/teamsync-monorepo.git
   cd teamsync-monorepo
   ```

2. Install dependencies from the repository root (installs all workspaces, including this one):
   ```sh
   pnpm install
   ```

3. Configure environment variables:
   - In `apps/server`, copy `.env.example` to `.env` and fill in required values (MongoDB URI, session secret, etc.)

4. Run database seeders (optional), from the repo root:
   ```sh
   pnpm --filter team-sync-server run seed:roles    # Seed user roles
   pnpm --filter team-sync-server run seed          # Seed all data
   ```

### Running the Server

**Development** (from repo root):
```sh
pnpm --filter team-sync-server dev
```

**Production:**
```sh
pnpm --filter team-sync-server build
pnpm --filter team-sync-server start
```

The server will start on the configured port (default: `8000`, see `.env.example`).

## Deployment

### Render Deployment

This application is configured for deployment on [Render](https://render.com/) via the `render.yaml` Blueprint at the repository root. The Blueprint builds and starts only the `team-sync-server` workspace using Turborepo filters, so the whole monorepo can be deployed as a single Render Blueprint without a separate Root Directory setting.

**Quick Deploy to Render:**
1. Fork this repository
2. In the Render dashboard, create a new Blueprint pointing at your fork (Render will detect `render.yaml` at the repo root)
3. Fill in the secret environment variables flagged `sync: false` in `render.yaml` (Mongo URI, session secret, Google OAuth credentials, frontend origin, etc.)
4. Render deploys automatically on push to `main`

### Environment Variables

See `apps/server/.env.example` for the complete list of required environment variables for production deployment.

## API Documentation

### Swagger UI

Interactive API documentation is available at:

**Development:**
```
http://localhost:8000/api/docs
```

**Production (Render):**
```
https://your-app-name.onrender.com/api/docs
```

All endpoints, request/response schemas, and authentication details are documented.

## Postman API Testing

A comprehensive Postman collection is available for testing all API endpoints:

- [Postman Collection Link](https://www.postman.com/collections/your-collection-link)

> Replace `your-collection-link` with your actual Postman collection URL.

## Folder Structure

```
apps/server/
├── src/
│   ├── controllers/      # Route handlers for API endpoints
│   ├── models/           # Mongoose models
│   ├── routes/           # Express route definitions
│   ├── services/         # Business logic and data access
│   ├── middlewares/      # Express middlewares
│   ├── enums/            # Enum definitions
│   ├── utils/            # Utility functions and error classes
│   ├── validation/       # Zod schemas for request validation
│   ├── config/           # App, database, and Swagger config
│   └── seeders/          # Initial data seeders
├── package.json
├── eslint.config.mjs
├── tsconfig.json
└── README.md
```

## Available Scripts

Run these via `pnpm --filter team-sync-server <script>` from the repo root, or directly with `pnpm run <script>` from within `apps/server`:

| Script | Description |
| --- | --- |
| `dev` | Start the dev server with live reload (`ts-node-dev`) |
| `build` | Type-check and compile TypeScript to `dist/` |
| `start` | Run the compiled server from `dist/index.js` |
| `type-check` | Run `tsc --noEmit` (strict mode) |
| `lint` | Run ESLint (`--max-warnings=0`) |
| `seed` | Seed all reference/demo data |
| `seed:roles` | Seed roles only |

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the MIT License.

## Author

Maintained by [hasnaintypes](https://github.com/hasnaintypes)
