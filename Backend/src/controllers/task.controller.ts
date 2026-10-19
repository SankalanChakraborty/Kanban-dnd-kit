import type { Request, Response } from "express";
import Task from "../models/task.model.ts";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    const {
      id,
      title,
      description,
      status,
      priority,
      dueDate,
      assignee,
      columnId,
    } = req.body as {
      id?: string;
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      dueDate?: string;
      assignee?: { name: string; avatarColor: string };
      columnId?: string;
    };

    if (!id || !title || !columnId) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields" });
    }

    const newtask = new Task({
      user,
      id,
      title,
      description,
      status,
      priority,
      dueDate,
      assignee,
      columnId,
    });
    await newtask.save();
    res.status(201).json({
      status: "success",
      message: "Task created successfully",
      task: newtask,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error creating task" });
  }
};

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    const tasks = await Task.find({ user });
    res.status(200).json({
      status: "success",
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error fetching tasks" });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, title, description, priority, dueDate, columnId } =
      req.body as {
        status?: string;
        title?: string;
        description?: string;
        priority?: string;
        dueDate?: string;
        columnId?: string;
      };
    if (
      status === undefined &&
      title === undefined &&
      description === undefined &&
      priority === undefined &&
      dueDate === undefined &&
      columnId === undefined
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "No fields to update" });
    }
    const { taskId } = req.params;
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    console.log("Update task>>>>>>>", taskId);
    const task = await Task.findOne({ id: taskId, user });
    if (!task) {
      return res
        .status(404)
        .json({ status: "error", message: "Task not found" });
    }
    const updatedTask = await Task.findOneAndUpdate(
      {
        id: taskId,
        user,
      },
      { status, title, description, priority, dueDate, columnId },
      { new: true },
    );
    res.status(200).json({
      status: "success",
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error updating task" });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    const task = await Task.findOneAndDelete({
      id: req.params.taskId,
      user,
    });
    if (!task) {
      return res
        .status(404)
        .json({ status: "error", message: "Task not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error deleting task" });
  }
};
