import express from "express";
import {
  getAllUsers,
  login,
  logout,
  register,
  rotateToken,
} from "../controllers/user.controller.ts";

const router = express.Router();

// admin route to get all users
router.get("/", getAllUsers);

router.post("/auth/login", login);
router.post("/auth/register", register);
router.post("/auth/logout", logout);
router.get("/auth/refresh", rotateToken);

export default router;
