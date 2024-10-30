import { logError, logInfo } from "../util/logging.js";

import axios from "axios";

// Fetch books based on user preferences
export const getBooksByPreference = async (req, res) => {
  const { preference, startIndex } = req.query; // Get query parameters from the request
  logInfo("Fetching books for preference:", preference);
  if (!preference) {
    return res.status(400).json({ error: "Preference is required" });
  }

  try {
    const googleBooksApiKey = process.env.API_KEY; // Get Google Books API key from environment variables
    logInfo("googleapikey", googleBooksApiKey);
    // Make a request to Google Books API
    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q: preference,
          maxResults: 36,
          startIndex: startIndex,
        },
      },
    );
    logInfo("Fetching books for preference:", preference);
    logInfo("Google API Key:", googleBooksApiKey);
    // Return the books fetched from the API
    res.json(response.data.items || []);
  } catch (error) {
    logError("googleapikey", process.env.API_KEY);
    logError("Error fetching books from Google API:", error.message);
    res.status(500).json({ error: "Error fetching books" });
  }
};
