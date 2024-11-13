import { getBooksByPreference } from "../controllers/recomController.js";
import express from "express";
const recommendationRouter = express.Router();

recommendationRouter.get("/", getBooksByPreference);
export default recommendationRouter;
