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

### Prerequisites

- Node.js >= 18.x
- MongoDB instance (local or MongoDB Atlas)

### Local Development

1. Clone the repository:
   ```sh
   git clone https://github.com/hasnaintype/teamsync-server.git
   cd teamsync-server
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` and fill in required values (MongoDB URI, session secret, etc.)

4. Run database seeders (optional):
   ```sh
   npm run seed:roles    # Seed user roles
   npm run seed          # Seed all data
   ```

### Running the Server

**Development:**
```sh
npm run dev
```

**Production:**
```sh
npm run build
npm start
```

The server will start on the configured port (default: 5000).

## Deployment

### Railway Deployment

This application is configured for deployment on Railway. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy to Railway:**
1. Fork this repository
2. Connect your GitHub repo to Railway
3. Configure environment variables in Railway dashboard
4. Deploy automatically triggers on push to main branch

### Environment Variables

See `.env.production` for a complete list of required environment variables for production deployment.

## API Documentation

### Swagger UI

Interactive API documentation is available at:

**Development:**
```
http://localhost:5000/api/docs
```

**Production (Railway):**
```
https://your-app-name.railway.app/api/docs
```

All endpoints, request/response schemas, and authentication details are documented.

## Postman API Testing

A comprehensive Postman collection is available for testing all API endpoints:

- [Postman Collection Link](https://www.postman.com/collections/your-collection-link)

> Replace `your-collection-link` with your actual Postman collection URL.

## Folder Structure

```
server/
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
├── tsconfig.json
└── README.md
```

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the MIT License.

## Author

Maintained by [hasnaintype](https://github.com/hasnaintype)
