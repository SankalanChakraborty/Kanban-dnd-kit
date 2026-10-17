import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import User from "../models/user.model.ts";
import {
  clearAuthCookies,
  hashToken,
  secret,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
} from "../utils/tokens.ts";

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
    // const accessToken = signAccessToken(user._id.toString());

    // const refreshToken = signRefreshToken(user._id.toString());

    // Set the tokens in HTTP-only cookies
    setAuthCookies(
      res,
      req,
      signAccessToken(user._id.toString()),
      signRefreshToken(user._id.toString()),
    );

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
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(token, secret("REFRESH_TOKEN_SECRET"), {
          algorithms: ["HS256"],
        }) as JwtPayload;

        await User.updateOne(
          { _id: payload.id },
          {
            $addToSet: {
              disAllowedRefreshTokens: {
                tokenHash: hashToken(token),
                expiresAt: new Date((payload.exp as number) * 1000),
              },
            },
          },
        );
      } catch {
        // Expired or invalid token: nothing to revoke
      }
    }
    clearAuthCookies(res);
    return res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
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

export const rotateToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    let payload: JwtPayload;
    try {
      const decoded = jwt.verify(token, secret("REFRESH_TOKEN_SECRET"), {
        algorithms: ["HS256"],
      });
      if (typeof decoded === "string") throw new Error("Invalid payload");
      payload = decoded;
    } catch {
      clearAuthCookies(res);
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // One atomic step: revoke this token only if it hasn't been used before.
    // Two concurrent refreshes with the same token can't both succeed.
    const user = await User.findOneAndUpdate(
      {
        _id: payload.id,
        "disAllowedRefreshTokens.tokenHash": { $ne: hashToken(token) },
      },
      {
        $push: {
          disAllowedRefreshTokens: {
            tokenHash: hashToken(token),
            expiresAt: new Date((payload.exp as number) * 1000),
          },
        },
      },
    );

    if (!user) {
      // Token was already used or revoked (or the user no longer exists)
      clearAuthCookies(res);
      return res
        .status(401)
        .json({ message: "Refresh token reuse detected, please log in again" });
    }

    const userId = user._id.toString();
    setAuthCookies(res, req, signAccessToken(userId), signRefreshToken(userId));
    return res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error refreshing token" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const { id } = (req as Request & { user: { id: string } }).user;
  try {
    const user = await User.findOne({ _id: id }, { _id: 1, name: 1, email: 1 });
    // console.log(user);
    return res.json({
      status: "success",
      isAuthenticated: true,
      user,
    });
  } catch (error) {
    throw new Error("Either user doesn't exist or is not authenticated");
  }
};
