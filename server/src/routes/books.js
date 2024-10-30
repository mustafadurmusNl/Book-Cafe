import express from "express";
import { createBook, getAllBooks } from "../controllers/bookController.js";
import axios from "axios";
import fs from "fs"; // Import file system for logging

const bookRouter = express.Router();

bookRouter.post("/create", createBook);
bookRouter.get("/", getAllBooks);

// Helper function to log messages to a file
const logToFile = (message) => {
  if (process.env.NODE_ENV !== "production") {
    // Only log to file in non-production
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync("debug.log", logMessage);
  }
};

bookRouter.get("/search", async (req, res) => {
  const { query } = req.query;
  const apiKey = process.env.API_KEY;

  // Log presence of API Key and Query parameter
  logToFile("Google API Key is set.");
  logToFile(`Search Query parameter: ${query}`);

  if (!query) {
    logToFile("Error: Query parameter is missing.");
    return res.status(400).json({ error: "Query parameter is required." });
  }

  // Parse query for title, author, or category
  let searchQuery = query
    .toLowerCase()
    .split(" ")
    .map((term) => {
      if (term.startsWith("author:")) return `inauthor:${term.slice(7)}`;
      if (term.startsWith("category:")) return `subject:${term.slice(9)}`;
      return term;
    })
    .join(" ");

  // Log the final search query
  logToFile(`Formatted Search Query: ${searchQuery}`);

  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${apiKey}`, // Add the API key in the query
    );

    // Log response data
    logToFile(`API Response: ${JSON.stringify(response.data)}`);

    if (response.data && response.data.items) {
      res.json({ success: true, data: response.data.items }); // Standardized success response
    } else {
      res.status(404).json({ success: false, error: "No books found." });
    }
  } catch (error) {
    // Log error details
    logToFile(
      `Error fetching data from Google Books API: ${error.response?.data || error.message}`,
    );
    res.status(500).json({
      success: false,
      error: "Failed to fetch data from Google Books API.",
      details: error.response?.data || error.message,
    });
  }
});

export default bookRouter;
