import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/user.model.ts";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ name, email, password: hashedPassword });
    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {}
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Email id or password is incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Email id or password is incorrect" });
    }

    const accessToken = jwt.sign(
      user._id,
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      user._id,
      process.env.REFREH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  } catch (error) {}
};

export const logout = async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    const user = await User.findOne({ email });
    if (user) {
      user.disAllowedRefreshTokens.push(req.cookies.refreshToken);
      await user.save();
    }
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {}
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find(
      {},
      { password: 0, disAllowedRefreshTokens: 0 },
    );
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users" });
  }
};
