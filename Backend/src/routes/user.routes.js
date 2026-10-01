import express from "express";
import {
  getAllUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller";

const router = express.Router();

// admin route to get all users
router.get("/", getAllUsers);

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

export default router;
