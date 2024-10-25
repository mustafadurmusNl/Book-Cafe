/* eslint-disable no-unused-vars */
import express from "express";
import {
  registerUser,
  loginUser,
  getall,
  updateUserPreferences,
  UserPreferences,
} from "../controllers/user.js";
import authenticateJWT from "./auth.js"; // Change to import for consistency
import { saveUserFavoriteAuthor } from "../controllers/author.js";
import { getBooksByFavoriteAuthors } from "../controllers/authorbook.js";

const userRouter = express.Router();

// User routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/getall", getall);
userRouter.put("/:id", updateUserPreferences);
userRouter.get("/:id/preferences", UserPreferences);
userRouter.put("/:id/favoriteAuthors", authenticateJWT, saveUserFavoriteAuthor);

userRouter.get(
  "/:id/favoriteAuthors",
  authenticateJWT,
  getBooksByFavoriteAuthors,
);
userRouter.post("/categories", authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const preferences = req.body.preferences;

  // Validate preferences (optional)
  if (!Array.isArray(preferences)) {
    return res.status(400).send({ message: "Preferences must be an array." });
  }

  res.status(200).send({ message: "Categories saved successfully!" });
});

export default userRouter;
