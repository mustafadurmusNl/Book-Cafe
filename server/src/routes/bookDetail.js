import express from "express";
import { getBookDetail } from "../controllers/bookDetailController.js";

const bookDetailRouter = express.Router();

bookDetailRouter.get("/:id", getBookDetail);

export default bookDetailRouter;
