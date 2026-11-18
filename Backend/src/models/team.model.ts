import mongoose from "mongoose";

const TEAM_ROLES = ["owner", "member", "viewer"];

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        role: {
          type: String,
          enum: TEAM_ROLES,
          default: "member",
        },
      },
    ],
  },
  { timestamps: true },
);
