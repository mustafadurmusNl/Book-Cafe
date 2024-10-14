import express from "express";

import { registerUser, loginUser, getall } from "../controllers/user.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/getall", getall);

export default userRouter;
