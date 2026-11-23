import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.ts";
import Workspace from "../models/workspace.model.ts";
import User from "../models/user.model.ts";

export const createWorkspace = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id;
  const { workspaceName } = req.body as { workspaceName?: string };

  if (!userId) {
    return res.status(401).json({
      status: "error",
      code: "AUTH_FAILED",
      isAuthenticated: false,
      message: "Unauthorized",
    });
  }
  const name = typeof workspaceName === "string" ? workspaceName?.trim() : "";

  //duplicate workspace name for same user
  const isDuplicate = await Workspace.exists({
    owner: userId,
    name: workspaceName,
  });

  if (isDuplicate) {
    return res.status(409).json({
      status: "error",
      code: "WORKSPACE_NAME_TAKEN",
      message: "You already have a workspace with this name.",
    });
  }

  if (name.length < 3 || name.length > 50) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_WORKSPACE_NAME",
      message: "Workspace name must be between 3 and 50 characters.",
    });
  }
  try {
    const newWorkspace = await Workspace.create({
      name,
      owner: userId,
      members: [{ user: userId, role: "owner" }],
    });

    await User.updateOne(
      { _id: userId },
      {
        $addToSet: { workspace: newWorkspace._id },
        $set: { lastActiveWorkspace: newWorkspace._id },
      },
    );

    return res.status(201).json({
      status: "success",
      code: "WORKSPACE_CREATED",
      workspace: {
        id: newWorkspace._id,
        name: newWorkspace.name,
      },
      message: "Workspace created successfully",
    });
  } catch (error) {
    console.error("createWorkspace failed:", error);
    return res.status(500).json({
      status: "error",
      code: "INTERNAL_ERROR",
      message: "Something went wrong. Please try again.",
    });
  }
};

export const getMyWorkspace = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      status: "error",
      code: "AUTH_FAILED",
      isAuthenticated: false,
      message: "Unauthorized",
    });
  }

  const user = await User.findOne({ _id: userId }, { lastActiveWorkspace: 1 });

  const myWorkspace = await Workspace.find({ _id: user?.lastActiveWorkspace });

  return res.status(201).json({
    status: "success",
    code: "WORKSPACE_FETCHED",
    myWorkspace,
    message: "Worskspaces fetched successfully",
  });
};
