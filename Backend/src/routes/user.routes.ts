import express from "express";
import {
  getCurrentUser,
  getAllUsers,
  login,
  logout,
  register,
  rotateToken,
  verifyEmailHandler,
  resetPassword,
  forgotPassword,
} from "../controllers/user.controller.ts";

import authMiddleware from "../middleware/auth.middleware.ts";

const router = express.Router();

// admin route to get all users
router.get("/", getAllUsers);

router.post("/auth/login", login);
router.get("/auth/me", authMiddleware, getCurrentUser);
router.post("/auth/register", register);
router.get("/auth/verify-email", verifyEmailHandler);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/logout", logout);
router.get("/auth/refresh", rotateToken);

export default router;
