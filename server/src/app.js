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

// Middleware for CORS
app.use(
  cors({
    origin: "http://localhost:8080", // Make sure this matches your front-end's local server port
    credentials: true,
  }),
);

// Apply HTTPS redirection only in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.secure) {
      next(); // Request was via https, so do no special handling
    } else {
      res.redirect("https://" + req.headers.host + req.url); // Redirect to https
    }
  });
}

// Other middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Session setup with MongoStore (update your session settings as needed)
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
app.use("/api/auth", router);
app.use("/api/recommendedBooks", recommendationRouter);
app.use("/api/book", bookDetailRouter);

// MongoDB connection
connectDB();

export default app;
