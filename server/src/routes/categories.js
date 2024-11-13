import express from "express";
import { saveUserCategories } from "../controllers/categoryController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const categoryRouter = express.Router();

categoryRouter.post("/", authenticateJWT, saveUserCategories);

export default categoryRouter;
