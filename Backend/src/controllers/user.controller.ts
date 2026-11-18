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
import { normalizeEmail } from "../utils/normalizeEmail.ts";

const redirectToLogin = (res: Response, params: Record<string, string>) => {
  const url = new URL("/login", process.env.FRONTEND_URL as string);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return res.redirect(url.toString());
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: normalizeEmail(email),
    });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email: normalizeEmail(email),
      password: hashedPassword,
      isEmailVerified: false,
    });

    // send email verification link
    const verificationLink = `${process.env.BACKEND_URL}/auth/verify-email?token=${emailVerificationToken(newUser._id.toString())}`;

    const emailBody = `
    <p>Please click <a href="${verificationLink}">here</a> to verify your email.</p>
    <p>If you did not create an account, please ignore this email.</p>
    `;

    let sendEmailResponse;
    try {
      sendEmailResponse = await sendEmail(
        newUser.email,
        "Verify your email",
        emailBody,
      );
      console.log("Email sent response:", sendEmailResponse); // Debugging line

      if (sendEmailResponse.ok) {
        // update email verification token details
        newUser.emailVerificationToken = emailVerificationToken(
          newUser._id.toString(),
        );

        newUser.emailVerificationExpiresAt = new Date(
          Date.now() + 24 * 60 * 60 * 1000,
        );

        newUser.emailVerificationSentAt = new Date();
      }
    } catch (error) {
      console.error("Failed to send email verification:", error);
      return res.status(500).json({
        status: "error",
        code: "EMAIL_SEND_FAILED",
        message: "Failed to send email verification. Please try again.",
      });
    }

    await newUser.save();

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        isEmailVerified: newUser.isEmailVerified,
        workspace: newUser.workspace,
        teams: newUser.teams,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("User registration failed:", error);
    return res.status(500).json({
      status: "error",
      code: "INTERNAL_ERROR",
      message: "Something went wrong. Please try again.",
    });
  }
};

export const resendEmailVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }
    const newUser = await User.findOne({ email: normalizeEmail(email) });

    if (!newUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (newUser.isEmailVerified) {
      return res.status(409).json({
        status: "error",
        code: "ALREADY_VERIFIED",
        message: "This email is already verified.",
      });
    }

    const COOLDOWN_MS = 42_000; // user can only request another verification mail after 42s
    const elapsed =
      Date.now() - (newUser.emailVerificationSentAt?.getTime() ?? 0);
    if (elapsed < COOLDOWN_MS) {
      const retryAfter = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
      res.set("Retry-After", String(retryAfter));
      return res.status(429).json({
        status: "error",
        code: "COOLDOWN_ACTIVE",
        retryAfter,
        message: `Please wait ${retryAfter}s before requesting another email.`,
      });
    }

    // send email verification link
    const verificationLink = `${process.env.BACKEND_URL}/auth/verify-email?token=${emailVerificationToken(newUser._id.toString())}`;

    const emailBody = `
  <p>Please click <a href="${verificationLink}">here</a> to verify your email.</p>
  <p>If you did not create an account, please ignore this email.</p>
  `;

    try {
      const resendEmailResponse = await sendEmail(
        newUser.email,
        "Verify your email",
        emailBody,
      );

      console.log("Resend email response", resendEmailResponse);
      if (resendEmailResponse.ok) {
        newUser.emailVerificationToken = emailVerificationToken(
          newUser?._id.toString(),
        );

        newUser.emailVerificationExpiresAt = new Date(
          Date.now() + 24 * 60 * 60 * 1000,
        );

        newUser.emailVerificationSentAt = new Date();
      }
    } catch (error) {
      console.error("resendEmailVerification failed:", error);
      return res.status(500).json({
        status: "error",
        code: "INTERNAL_ERROR",
        message: "Something went wrong. Please try again.",
      });
    }

    await newUser.save();
    return res.status(200).json({
      status: "success",
      message: `Another verification link has been sent to ${newUser.email}`,
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(409).json({
        status: "error",
        code: "EMAIL_EXISTS",
        message: "User with this email already exists",
      });
    }
    console.error("register failed:", error);
    return res.status(500).json({
      status: "error",
      code: "INTERNAL_ERROR",
      message: "Error registering user",
    });
  }
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  if (!token)
    return redirectToLogin(res, { verified: "false", reason: "invalid" });

  try {
    const payload = jwt.verify(
      token,
      process.env.EMAIL_VERIFICATION_SECRET as string,
    ) as JwtPayload;
    const user = await User.findById(payload.id);
    if (!user)
      return redirectToLogin(res, { verified: "false", reason: "invalid" });

    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      user.emailVerificationSentAt = undefined;
      await user.save();
    }
    return redirectToLogin(res, { verified: "true" });
  } catch (error) {
    // TokenExpiredError extends JsonWebTokenError, so check it first
    if (error instanceof jwt.TokenExpiredError)
      return redirectToLogin(res, { verified: "false", reason: "expired" });
    if (error instanceof jwt.JsonWebTokenError)
      return redirectToLogin(res, { verified: "false", reason: "invalid" });
    console.error("verifyEmailHandler failed:", error);
    return redirectToLogin(res, { verified: "false", reason: "server" });
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
        status: "error",
        message: "If the email exists, a password reset link will be sent.",
      });
    }
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    user.passwordResetToken = tokenHash;
    user.passwordResetTokenExpiresAt = expiresAt;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

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
      status: "success",
      message:
        "Password reset link sent to your email if it exists in our system.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body as {
    token?: string;
    password?: string;
  };

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
