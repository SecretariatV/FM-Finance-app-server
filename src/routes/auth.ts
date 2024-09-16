import authController from "controllers/authController";
import { Router } from "express";
import passport from "passport";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/confirm",
    failureRedirect: "/register",
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/confirm",
    failureRedirect: "/register",
    failureFlash: true,
  })
);

router.post("/register", authController.register);

router.get("/logout", authController.logout);

export default router;
