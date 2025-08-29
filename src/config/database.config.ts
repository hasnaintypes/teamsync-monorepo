import mongoose from "mongoose";
import { config } from "./app.config";

/**
 * Connects to the MongoDB database using Mongoose.
 * Logs success or error messages based on the connection status.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 * @throws {Error} If the connection fails, it logs the error and exits the process
 */
const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("[Database] Connected to MongoDB database");
  } catch (error) {
    console.error("[Database] Error connecting to MongoDB database");
    process.exit(1);
  }
};

export default connectDatabase;
