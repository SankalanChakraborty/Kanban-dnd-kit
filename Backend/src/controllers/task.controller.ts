import { Request, Response } from "express";
import Task from "../models/task.model.ts";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
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
      return res.status(400).json({ message: "Missing required fields" });
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
    res
      .status(201)
      .json({ message: "Task created successfully", task: newtask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, title, description, priority } = req.body as {
      status?: string;
      title?: string;
      description?: string;
      priority?: string;
    };
    if (!status && !title && !description && !priority) {
      return res.status(400).json({ message: "No fields to update" });
    }
    const { taskID } = req.params;
    const user = req.user?.id;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const task = await Task.findOne({ id: taskID, user });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const updatedTask = await Task.findOneAndUpdate(
      {
        id: taskID,
        user,
      },
      { status, title, description, priority },
      { new: true },
    );
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};
