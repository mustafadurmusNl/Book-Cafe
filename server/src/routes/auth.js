import express from "express";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    try {
      const token = req.user.generateJWT();
      const userId = req.user._id;
      const isNewUser = req.user.firstLogin;
      if (isNewUser) {
        await User.findByIdAndUpdate(userId, { firstLogin: false });
      }

      res.redirect(
        `http://localhost:8080?token=${token}&userId=${userId}&isNewUser=${isNewUser}`,
      );
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  },
);

export default router;
