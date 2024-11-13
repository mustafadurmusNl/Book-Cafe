import mongoose from "mongoose";
import { logError } from "../util/logging.js";
import { logInfo } from "../util/logging.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    logInfo("MongoDB connected successfully");
  } catch (error) {
    logError(new Error("Failed to connect to MongoDB: " + error.message));
    process.exit(1);
  }
};

export default connectDB;
