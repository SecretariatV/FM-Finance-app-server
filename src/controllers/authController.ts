import logger from "config/logger";
import { Request, Response } from "express";
import crypto from "crypto";
import User from "models/User";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:4000/auth/google/callback"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.error("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const confirmationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      username,
      email,
      password,
      confirmationToken,
    });
    await newUser.save();

    logger.info(`Success register user: ${email}`);
    return res.status(200).json({ message: "Register your account." });
  } catch (error) {
    logger.error(`Error registering user: ${error}`);
    res.status(500).json({ message: "Error registering user" });
  }
};

const logout = (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect("/login");
  });
};

export default { register, logout };
