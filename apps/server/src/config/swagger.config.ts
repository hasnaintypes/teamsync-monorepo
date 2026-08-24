import swaggerJsdoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Team Sync API",
      version: "1.0.0",
      description: "API documentation for Team Sync Server",
    },
    servers: [
      {
        url: "/api",
        description: "Base API path",
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
          description: "Session-based authentication using cookies",
        },
      },
    },
  },
  apis: ["src/controllers/**/*.ts", "src/models/**/*.ts"], // Adjust as needed
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
