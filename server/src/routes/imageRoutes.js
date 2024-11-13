import express from "express";
import multer from "multer";
import {
  uploadProfileImage,
  getUserProfile,
} from "../controllers/imageController.js";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import path from "path";
const imageRoutes = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      "Error: File upload only supports the following filetypes - " + filetypes,
    );
  },
});

imageRoutes.post(
  "/upload",
  ensureAuthenticated,
  upload.single("profileImage"),
  uploadProfileImage,
);
imageRoutes.get("/", ensureAuthenticated, getUserProfile);

export default imageRoutes;
