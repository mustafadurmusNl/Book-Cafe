import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  Image: { type: String },
  preferences: { type: [String], default: [] },
  firstLogin: { type: Boolean, default: true },
});
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
