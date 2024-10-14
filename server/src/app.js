import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import connectDB from "./db/connectDB.js";
import userRoutes from "./routes/user.js";
import router from "./routes/auth.js";
import "./controllers/passport.js";

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

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", router);

// MongoDB connection
connectDB();

export default app;
