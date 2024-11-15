import User from "../models/User.js";
import { logError, logInfo, logWarning } from "../util/logging.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import axios from "axios";

export const registerUser = async (req, res) => {
  logInfo("RegisterUser function called with data:", req.body);
  try {
    const { name, email, password, preferences, confirmPassword } = req.body;
    if (!name) {
      return res.json({ error: "Name is required" });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({ error: "Email is already taken" });
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      preferences,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      message: "Registration successful. Welcome!",
      name: user.name,
      id: user._id,
      token,
    });
  } catch (error) {
    logError("Error in registerUser:", error);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "No user found with this email" });
    }

    const match = await comparePassword(password, user.password);
    if (match) {
      const token = jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.json({
        message: "Login successful",
        name: user.name,
        token: token,
        id: user._id,
        profileImage: user.profileImage,
      });
    } else {
      return res.status(401).json({ error: "Incorrect password" });
    }
  } catch (error) {
    logError("Error in loginUser:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getall = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    logError("Error in getall:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
export const updateUserPreferences = async (req, res) => {
  try {
    const userId = req.params.id;
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({ error: "Preferences are required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.preferences = preferences;
    await user.save();
    res.status(200).json({
      message: "Preferences updated successfully",
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const UserPreferences = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ preferences: user.preferences });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
export const updateUserBooks = async (req, res) => {
  try {
    const userId = req.params.id;
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ error: "Book ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.favoriteBook.includes(bookId)) {
      user.favoriteBook.push(bookId);
    }

    await user.save();

    res.status(200).json({
      message: "Book added to favorites successfully",
      favoriteBook: user.favoriteBook,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getUserFavoriteBooks = async (req, res) => {
  const { userId } = req.params;
  logInfo("Received request for userId:", userId);

  try {
    const user = await User.findById(userId).select("favoriteBook");
    logInfo("User fetched:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const favoriteBookIds = user.favoriteBook || [];
    logInfo("Favorite book IDs:", favoriteBookIds);

    if (favoriteBookIds.length === 0) {
      return res.status(200).json([]);
    }

    const bookDetailsPromises = favoriteBookIds.map((bookId) =>
      fetchBookDetailsWithRetry(bookId),
    );

    const bookDetailsResponses = await Promise.all(bookDetailsPromises);
    const bookDetails = bookDetailsResponses.filter(
      (response) => response !== null,
    );

    res.status(200).json(bookDetails);
  } catch (error) {
    logError("Error fetching user favorite books:", error);
    res.status(500).json({ error: "Failed to fetch user favorite books" });
  }
};

export const removeFavoriteBook = async (req, res) => {
  const { userId, bookId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.favoriteBook = user.favoriteBook.filter((id) => id !== bookId);

    await user.save();

    res.status(200).json({ message: "Favorite book removed successfully." });
  } catch (error) {
    logError("Error removing favorite book:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const fetchBookDetailsWithRetry = async (bookId, retries = 3, delay = 1000) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${process.env.API_KEY}`,
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      logWarning(
        `Rate limit hit for book ID ${bookId}. Retrying in ${delay}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchBookDetailsWithRetry(bookId, retries - 1, delay * 2);
    }
    logError(
      `Failed to fetch book with ID ${bookId}:`,
      error.response ? error.response.data : error.message,
    );
    return null;
  }
};
