import mongoose from "mongoose";
import { config } from "./app.config";
import { logger } from "../utils/logger";

const RETRY_INTERVAL_MS = 5000;

/**
 * Connects to the MongoDB database using Mongoose.
 * Logs success or error messages based on the connection status.
 *
 * On failure, this retries after a short delay instead of crashing the
 * process (`process.exit`). This keeps the server — and its `/health`
 * endpoint — reachable during a transient database outage, so the health
 * check can accurately report `database: "disconnected"` instead of the
 * whole process being killed and restarted in a crash loop.
 *
 * @returns {Promise<void>} Resolves once a connection attempt has completed
 * (success or scheduled retry).
 */
const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info("Connected to MongoDB database");
  } catch (error) {
    logger.error(
      `Error connecting to MongoDB database, retrying in ${
        RETRY_INTERVAL_MS / 1000
      }s`,
      { error }
    );
    setTimeout(connectDatabase, RETRY_INTERVAL_MS);
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB connection lost");
});

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB connection restored");
});

export default connectDatabase;
