/* eslint-disable no-dupe-keys */
import User from "../models/User.js";
import { logError } from "../util/logging.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }

    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }

    // Check if email is already taken
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is taken already",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.json({ message: "welcome", name: user.name });
  } catch (error) {
    logError("Error in registerUser:", error);
    res
      .status(500)
      .json({ error: "Server error. Please try again later.", error });
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
      jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) {
            logError("JWT sign error:", err);
            return res.status(500).json({ error: "Failed to generate token" });
          }
          res
            .cookie("token", token)
            .json({ message: "Login successful", name: user.name });
          return res.redirect("/category");
        },
      );
    } else {
      return res.status(401).json({ error: "Incorrect password" });
    }
  } catch (error) {
    logError("Error in loginUser:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
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
