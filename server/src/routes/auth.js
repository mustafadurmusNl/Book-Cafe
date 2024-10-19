import express from "express";
import passport from "passport";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
const BASE_URL = process.env.FRONTEND_URL;
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const user = req.user;
    if (user.firstLogin) {
      user.firstLogin = false;
      await user.save();
      res.redirect(`${BASE_URL}/recommendations`);
    } else {
      res.redirect(`${BASE_URL}/categories`);
    }
  },
);
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
export default router;
