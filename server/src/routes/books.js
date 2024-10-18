// src/routes/books.js
import express from "express";
import { createBook, getAllBooks } from "../controllers/bookController.js"; // Import the controller methods

const bookRouter = express.Router();

// POST /api/books/create
bookRouter.post("/create", createBook);

// GET /api/books
bookRouter.get("/", getAllBooks);

export default bookRouter;
