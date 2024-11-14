import { logInfo, logError } from "../util/logging.js";
import axios from "axios";
import User from "../models/User.js";

export const getBooksByFavoriteAuthors = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const favoriteAuthors = user.favoriteAuthors;

    if (favoriteAuthors.length === 0) {
      return res.status(200).json({ message: "No favorite authors found." });
    }

    logInfo("User's favorite authors:", favoriteAuthors);

    const books = [];

    for (const author of favoriteAuthors) {
      try {
        logInfo("Fetching books for author:", author);

        const response = await axios.get(
          "https://www.googleapis.com/books/v1/volumes",
          {
            params: {
              q: `inauthor:${author}`,
              maxResults: 6,
              key: process.env.API_KEY,
            },
          },
        );

        if (response.data.items) {
          books.push(...response.data.items);
        }
      } catch (error) {
        logError(`Error fetching books for author ${author}:`, error.message);
      }
    }

    if (books.length === 0) {
      return res
        .status(200)
        .json({ message: "No books found for the favorite authors." });
    }

    const shuffledBooks = books.sort(() => 0.5 - Math.random());

    const randomBooks = shuffledBooks.slice(0, 6);

    res.status(200).json(randomBooks);
  } catch (error) {
    logError("Error in getBooksByFavoriteAuthors:", error.message);
    res
      .status(500)
      .json({ error: "Error fetching books by favorite authors." });
  }
};
