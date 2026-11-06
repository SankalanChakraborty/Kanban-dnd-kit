import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import type { Request, Response } from "express";
import User from "../models/user.model.ts";
import {
  clearAuthCookies,
  emailVerificationToken,
  hashToken,
  secret,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
} from "../utils/tokens.ts";
import sendEmail from "../utils/sendEmail.ts";

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

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
    });

    await newUser.save();

    // send email verification link
    const verificationLink = `${process.env.BACKEND_URL}/auth/verify-email?token=${emailVerificationToken(newUser._id.toString())}`;

    const emailBody = `
    <p>Please click <a href="${verificationLink}">here</a> to verify your email.</p>
    <p>If you did not create an account, please ignore this email.</p>
    `;

    const sendEmailResponse = await sendEmail(
      newUser.email,
      "Verify your email",
      emailBody,
    );

    console.log("Email sent response:", sendEmailResponse); // Debugging line

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

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const { token } = req.query as { token?: string };

  if (!token) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid verification token" });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.EMAIL_VERIFICATION_SECRET as string,
    ) as JwtPayload;
    const user = await User.findById(payload.id);
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();

      return res.status(200).json({
        status: "success",
        message: "Email verified successfully",
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid verification token" });
  }
};

export const login = async (req: Request, res: Response) => {
  // console.log("Login request body:", req.body); // Debugging line
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

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Email id or password is incorrect",
      });
    }
    console.log("User found:", user); // Debugging line

    if (!user.isEmailVerified) {
      return res.status(403).json({
        status: "error",
        message:
          "Email is not verified. Please verify your email before logging in.",
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

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };
  if (!email) {
    return res
      .status(400)
      .json({ status: "error", message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If the email exists, a password reset link will be sent.",
      });
    }
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    user.passwordResetToken = tokenHash;
    user.passwordResetTokenExpiresAt = expiresAt;
    await user.save();

    const resetLink = `${process.env.BACKEND_URL}/auth/reset-password?token=${rawToken}`;

    const emailBody = `
    <p>Please click <a href="${resetLink}">here</a> to reset your password.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
    `;

    const sendEmailResponse = await sendEmail(
      user.email,
      "Reset your password",
      emailBody,
    );

    console.log("Email sent response:", sendEmailResponse); // Debugging line

    return res.json({
      message: "If the email exists, a password reset link will be sent.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error occurred while processing forgot password request",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.query as {
    token?: string;
  };

  const { password } = req.body as { password?: string };

  if (!token) {
    return res
      .status(400)
      .json({ status: "error", message: "Reset token is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ status: "error", message: "New password is required" });
  }

  try {
    const tokenHash = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or expired reset token" });
    }
    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    user.tokenVersion += 1; // Invalidate all existing refresh tokens
    await user.save();

    return res.json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error occurred while resetting password",
    });
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
