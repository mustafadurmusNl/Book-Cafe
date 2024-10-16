// src/routes/categories.js
import express from "express";
import { saveUserCategories } from "../controllers/categoryController.js"; // Import the controller
import { authenticateJWT } from "../middleware/authMiddleware.js";

const categoryRouter = express.Router();

// POST /api/categories
categoryRouter.post("/", authenticateJWT, saveUserCategories); // Handle categories selection

export default categoryRouter;
