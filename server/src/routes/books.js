// src/routes/books.js
import express from "express";
import { createBook, getAllBooks } from "../controllers/bookController.js";
import axios from "axios";

const bookRouter = express.Router();

bookRouter.post("/create", createBook);
bookRouter.get("/", getAllBooks);

bookRouter.get("/search", async (req, res) => {
  const { query } = req.query;
  const apiKey = process.env.API_KEY;
  console.log("Google API Key:", apiKey);

  if (!query) {
    console.error("Query parameter is missing.");
    return res.status(400).json({ error: "Query parameter is required" });
  }

  let searchQuery = query
    .toLowerCase()
    .split(" ")
    .map((term) => {
      if (term.startsWith("author:")) return `inauthor:${term.slice(7)}`;
      if (term.startsWith("category:")) return `subject:${term.slice(9)}`;
      return term;
    })
    .join(" ");

  console.log("Search Query:", searchQuery); // لاگ برای نمایش کوئری نهایی

  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${apiKey}`,
    );
    console.log("API Response:", response.data); // لاگ برای نمایش پاسخ گوگل بوکس API

    if (response.data && response.data.items) {
      res.json(response.data);
    } else {
      res.status(404).json({ error: "No books found" });
    }
  } catch (error) {
    console.error(
      "Error fetching data from Google Books API:",
      error.response?.data || error.message,
    );
    res.status(500).json({
      error: "Failed to fetch data from Google Books API",
      details: error.response?.data || error.message,
    });
  }
});
export default bookRouter;
