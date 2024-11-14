import User from "../models/User.js";
import { uploadImage } from "../services/cloudinaryService.js";
import fs from "fs";
import path from "path";
import { logError } from "../util/logging.js";

const uploadProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const imageUrl = await uploadImage(req.file);

    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true },
    );

    fs.unlink(path.join(req.file.path), (err) => {
      if (err) {
        logError("Failed to delete local file: ", err);
      }
    });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { uploadProfileImage, getUserProfile };
