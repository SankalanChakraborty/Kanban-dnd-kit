import express from "express";
import { createTask } from "../controllers/task.controller";

const router = express.Router();

router.post("/create-task", authController, createTask);
router.get("/get-tasks", authController, getTasks);
router.put("/update-task/:taskId", authController, updateTask);
router.delete("/delete-task/:taskId", authController, deleteTask);

export default router;
