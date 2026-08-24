import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { asyncHandler } from "./middlewares/async-handler.middleware";
import { HTTP_STATUS } from "./config/http.config";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";

import "./config/passport.config";
import passport from "passport";
import { logger } from "./utils/logger";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import requireAuth from "./middlewares/auth.middleware";
import csrfProtection from "./middlewares/csrf.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

// Trust proxy (Render/Railway run the app behind a reverse proxy)
app.set('trust proxy', 1);

// Health check endpoint — placed before all other middleware (helmet, rate
// limiting, sessions, CORS) so it always responds quickly and is never
// throttled. Used by Render's healthCheckPath to determine service liveness.
const dbReadyStateLabels: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

app.get("/health", (req: Request, res: Response) => {
  const dbReadyState = mongoose.connection.readyState;
  res.status(HTTP_STATUS.OK).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbReadyStateLabels[dbReadyState] ?? "unknown",
  });
});

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const isProduction = config.NODE_ENV === "production";

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'session_id',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      // sameSite: "none" requires secure: true — both are coupled to isProduction
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      // In development, allow localhost variants
      if (config.NODE_ENV === "development") {
        const devOrigins = [
          config.FRONTEND_ORIGIN,
          "http://localhost:3000",
          "http://localhost:5173",
          "http://localhost:5174",
          "http://127.0.0.1:3000",
          "http://127.0.0.1:5173"
        ];
        if (devOrigins.includes(origin)) {
          return callback(null, true);
        }
      }
      
      // In production, check against allowed origins
      const allowedOrigins = [
        config.FRONTEND_ORIGIN,
        // Add specific Vercel domains
        'https://teamsync-io.vercel.app',
        'https://teamsyncio.vercel.app',
        // Add general Vercel domain patterns
        /https:\/\/.*\.vercel\.app$/,
        /https:\/\/team-sync.*\.vercel\.app$/,
      ];
      
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (typeof allowedOrigin === 'string') {
          return allowedOrigin === origin;
        }
        return allowedOrigin.test(origin);
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        logger.warn('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Essential for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200, // For legacy browser support
  })
);

// CSRF protection (after CORS)
app.use(csrfProtection);

// Swagger API docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.15.5/swagger-ui.css',
  customJs: [
    'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.15.5/swagger-ui-bundle.js',
    'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js'
  ],
  swaggerOptions: {
    url: undefined // Use the spec directly instead of loading from URL
  }
}));

// Serve the swagger JSON spec
app.get('/api/docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).json({
      message: "Welcome to the Team Sync Server",
      version: "1.0.0",
      basePath: BASE_PATH,
    });
  })
);

// Import routes
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, requireAuth, userRoutes);
app.use(`${BASE_PATH}/workspace`, requireAuth, workspaceRoutes);
app.use(`${BASE_PATH}/member`, requireAuth, memberRoutes);
app.use(`${BASE_PATH}/project`, requireAuth, projectRoutes);
app.use(`${BASE_PATH}/task`, requireAuth, taskRoutes);

app.use(errorHandler);

// Connect to database
connectDatabase();

// Start the server
app.listen(config.PORT, () => {
  logger.info(
    `Server listening on port ${config.PORT} in ${config.NODE_ENV} mode`
  );
});

// Export the app for testing purposes
export default app;
