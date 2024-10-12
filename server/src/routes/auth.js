import express from "express";
import passport from "passport";

const router = express.Router();

// Route to initiate Google OAuth login
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
      res.redirect("/preferences");
    } else {
      res.redirect("/category");
    }
  },
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

export default router;
