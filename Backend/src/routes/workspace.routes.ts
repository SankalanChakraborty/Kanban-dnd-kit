import express from "express";
import authMiddleware from "../middleware/auth.middleware.ts";
import {
  createWorkspace,
  getMyWorkspace,
} from "../controllers/workspace.controller.ts";

const router = express.Router();

router.post("/create-workspace", authMiddleware, createWorkspace);
router.get("/get-workspace", authMiddleware, getMyWorkspace);

export default router;
