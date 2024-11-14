import express from "express";
import {
  registerUser,
  loginUser,
  getall,
  updateUserPreferences,
  UserPreferences,
  updateUserBooks,
  getUserFavoriteBooks,
  removeFavoriteBook,
} from "../controllers/user.js";
import authenticateJWT from "./auth.js";
import { saveUserFavoriteAuthor } from "../controllers/author.js";
import { getBooksByFavoriteAuthors } from "../controllers/authorbook.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  (req, res, next) => {
    next();
  },
  registerUser,
);
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
userRouter.post("/:id/favoriteBook", authenticateJWT, updateUserBooks);
userRouter.get("/:userId/favoriteBooks", authenticateJWT, getUserFavoriteBooks);
userRouter.delete(
  "/:userId/favoriteBook/:bookId",
  authenticateJWT,
  removeFavoriteBook,
);
userRouter.post("/categories", authenticateJWT, (req, res) => {
  const preferences = req.body.preferences;

  if (!Array.isArray(preferences)) {
    return res.status(400).send({ message: "Preferences must be an array." });
  }

  res.status(200).send({ message: "Categories saved successfully!" });
});

export default userRouter;
