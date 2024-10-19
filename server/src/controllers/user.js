import User from "../models/User.js";
import { logError } from "../util/logging.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;
    if (!name) {
      return res.json({ error: "Name is required" });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
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
      expiresIn: "1h", // Token expiration time (adjust as needed)
    });

    // Return user information and token
    return res.status(201).json({
      message: "Registration successful. Welcome!",
      name: user.name,
      id: user._id, // Return the user ID
      token, // Return the JWT token
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
      // Create the token
      const token = jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }, // Set token expiration if needed
      );

      // Instead of setting it as a cookie, return it in the response
      res.json({
        message: "Login successful",
        name: user.name,
        token: token,
        id: user._id, // Send the token back to the client
      });
    } else {
      return res.status(401).json({ error: "Incorrect password" });
    }
  } catch (error) {
    logError("Error in loginUser:", error); // Log the error for debugging
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
    const userId = req.params.id; // Change to req.params.id
    const { preferences } = req.body; // New preferences from the request body

    // Validate input
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

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user preferences
    res.json({ preferences: user.preferences });
  } catch (err) {
    // Handle server error
    res.status(500).json({ error: "Server error" });
  }
};
