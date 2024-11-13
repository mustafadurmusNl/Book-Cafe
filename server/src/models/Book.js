import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  user_id: { type: Number, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  length: { type: Number, required: true },
  publisher: { type: String, required: true },
  publish_date: { type: Date, required: true },
  link: { type: String, required: true },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
