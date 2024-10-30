import express from "express";
import { getBookDetail } from "../controllers/bookDetailController.js";

const bookDetailRouter = express.Router();

bookDetailRouter.get("/", getBookDetail);

export default bookDetailRouter;
