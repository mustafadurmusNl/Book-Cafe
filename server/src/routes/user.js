/* eslint-disable no-unused-vars */
import express from "express";
import {
  registerUser,
  loginUser,
  getall,
  updateUserPreferences,
} from "../controllers/user.js";
import authenticateJWT from "./auth.js"; // Change to import for consistency

const userRouter = express.Router();

// User routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/getall", getall);
userRouter.put("/:id", updateUserPreferences);

// POST /api/categories - This route will save user preferences
userRouter.post("/categories", authenticateJWT, (req, res) => {
  const userId = req.user.id; // Get user ID from the verified token
  const preferences = req.body.preferences; // Extract preferences from request body

  // Validate preferences (optional)
  if (!Array.isArray(preferences)) {
    return res.status(400).send({ message: "Preferences must be an array." });
  }

  // Dummy in-memory store for user preferences (replace with database in production)
  // Assuming you want to save preferences to a database instead of in-memory.
  // For now, this example will just respond with success.
  // userPreferences[userId] = preferences; // Uncomment this if you implement userPreferences

  res.status(200).send({ message: "Categories saved successfully!" });
});

export default userRouter;
