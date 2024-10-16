import express from "express";

import {
  registerUser,
  loginUser,
  getall,
  getCurrentUser,
} from "../controllers/user.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/getall", getall);
// Protect this route with JWT authentication
userRouter.get("/me", getCurrentUser);

export default userRouter; // Ensure this line is correct
