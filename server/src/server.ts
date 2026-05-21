import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import logger from "./config/logger.js";
import { pool } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logging
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    if (req.url !== "/api/v1/health") {
      logger.info(`${req.method} ${req.url}`);
    }
    next();
  });
}

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/v1", routes);

// Root Endpoint
app.get("/", (_req, res) => {
  res.json({
    name: "Issue Tracker API",
    version: "2.0.0",
    description: "RESTful API for Issue Tracking Application",
    documentation: `/api-docs`,
    endpoints: {
      health: "GET /api/v1/health",
      auth: {
        register: "POST /api/v1/auth/register",
        login: "POST /api/v1/auth/login",
        profile: "GET /api/v1/auth/profile",
      },
      issues: "GET /api/v1/issues",
      myIssues: "GET /api/v1/issues/my-issues",
      users: "GET /api/v1/users",
    },
  });
});

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    // Verify DB connectivity
    await pool.query("SELECT 1");
    logger.info("Database connected successfully");

    app.listen(PORT, () => {
      logger.info("=".repeat(50));
      logger.info("ISSUE TRACKER SERVER STARTED");
      logger.info("=".repeat(50));
      logger.info(`Server:  http://localhost:${PORT}`);
      logger.info(`Env:     ${process.env.NODE_ENV || "development"}`);
      logger.info(`Docs:    http://localhost:${PORT}/api-docs`);
      logger.info("=".repeat(50));
    });
  } catch (error) {
    logger.fatal(error, "Failed to start server");
    process.exit(1);
  }
};

// Graceful Shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received: shutting down gracefully`);
  await pool.end();
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  logger.fatal(error, "Uncaught Exception");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.fatal(reason, "Unhandled Rejection");
  process.exit(1);
});

startServer();

export default app;
