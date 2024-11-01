import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import connectDB from "./db/connectDB.js";
import userRoutes from "./routes/user.js";
import router from "./routes/auth.js";
import "./controllers/passport.js";
import userRouter from "./routes/user.js";
import bookRouter from "./routes/books.js";
import recommendationRouter from "./routes/recommendation.js";
import bookDetailRouter from "./routes/bookDetail.js";
// Load environment variables
dotenv.config();

const app = express();
// Middleware
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Session setup with MongoStore

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/user", userRouter);
app.use("/api/books", bookRouter);
app.use("/api/users", userRoutes);
console.log("User routes initialized");
app.use("/api/auth", router);
// Set up the routes for book recommendations
app.use("/api/recommendedBooks", recommendationRouter);
app.use("/api/book", bookDetailRouter);
// MongoDB connection
connectDB();

export default app;
