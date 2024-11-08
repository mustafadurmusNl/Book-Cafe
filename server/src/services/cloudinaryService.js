import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path);
    return result.secure_url; // URL of the uploaded image
  } catch (error) {
    throw new Error("Cloudinary upload error: " + error.message);
  }
};