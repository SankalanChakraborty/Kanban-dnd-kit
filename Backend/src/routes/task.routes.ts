import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";

const router = express.Router();

router.post("/create-task", authMiddleware, createTask);
router.get("/get-tasks", authMiddleware, getTasks);
router.put("/update-task/:taskId", authMiddleware, updateTask);
router.delete("/delete-task/:taskId", authMiddleware, deleteTask);

export default router;
