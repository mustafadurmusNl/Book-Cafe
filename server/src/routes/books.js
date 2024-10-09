import express from "express";
import Book from "../models/Book.js"; // Import the Book model
import { logError } from "../util/logging.js";

const bookRouter = express.Router();

// POST /api/books/create
bookRouter.post("/create", async (req, res) => {
  try {
    const newBook = new Book(req.body); // Create a new book instance from the request body
    await newBook.save(); // Save the new book to the database
    res.status(201).json({
      success: true,
      book: newBook,
    }); // Respond with success
  } catch (error) {
    logError(error); // Log the error
    res.status(500).json({
      success: false,
      msg: "Unable to create book, please try again later.",
    });
  }
});

// GET /api/books - Retrieve all books
bookRouter.get("/", async (req, res) => {
  try {
    const books = await Book.find(); // Retrieve all books
    res.status(200).json({
      success: true,
      result: books,
    }); // Respond with books
  } catch (error) {
    logError(error); // Log the error
    res.status(500).json({
      success: false,
      msg: "Unable to retrieve books, please try again later.",
    });
  }
});

export default bookRouter;
