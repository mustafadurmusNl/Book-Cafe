import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import userRoutes from "./routes/user.js";

dotenv.config();

// Initialize the Express application
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:8080", // Replace with your frontend URL
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/", userRoutes);

// MongoDB connection
connectDB();

// Export the app for use in other modules
export default app;
