import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // eslint-disable-next-line prettier/prettier
  password: { type: String },
});

// eslint-disable-next-line no-unused-vars, prettier/prettier
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
