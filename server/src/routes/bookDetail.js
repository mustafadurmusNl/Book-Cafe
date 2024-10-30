import express from "express";
import { getBookDetail } from "../controllers/bookDetailController.js";

const bookDetailRouter = express.Router();

bookDetailRouter.get("/detail", getBookDetail);

export default bookDetailRouter;
