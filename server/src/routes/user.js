import express from "express";
// eslint-disable-next-line prettier/prettier
import { getall } from "../controllers/user.js";

const userRouter = express.Router();

userRouter.get("/", getall);

export default userRouter;
