import mongoose from "mongoose";
import ENV_CONFIG from "./env.config";

/**
 * Opens the single MongoDB connection used by the whole app.
 * Called once from server.ts before the HTTP server starts listening.
 */
const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV_CONFIG.dbUri);
    console.log("[database] connected successfully");
  } catch (error) {
    console.error("[database] connection failed:", error);
    process.exit(1);
  }
};

export default connectDatabase;
