import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
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
      return res
        .status(400)
        .json({ status: "error", message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error registering user" });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log("Login request body:", req.body); // Debugging line
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    console.log("User found:", user); // Debugging line

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Email id or password is incorrect",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("Password valid:", isPasswordValid); // Debugging line

    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Email id or password is incorrect",
      });
    }

    // Generate access token and refresh token
    const accessToken = jwt.sign(
      { user: user._id },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      { user: user._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      },
    );

    // Set the tokens in HTTP-only cookies
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

    return res.json({
      status: "success",
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error logging in" });
  }
};

export const logout = async (req: Request, res: Response) => {
  console.log("Logout request body:", req.body); // Debugging line
  const { email } = req.body as { email?: string };
  try {
    console.log("Email for logout:", email); // Debugging line
    if (!email) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is required" });
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const hashedRefreshToken = await bcrypt.hash(req.cookies.refreshToken, 10);

    user.disAllowedRefreshTokens.push(hashedRefreshToken);
    await user.save();

    return res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error logging out" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find(
      {},
      { password: 0, disAllowedRefreshTokens: 0 },
    );
    return res.status(200).json({ status: "success", users });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error fetching users" });
  }
};

export const rotateToken = async (req: Request, res: Response) => {};
