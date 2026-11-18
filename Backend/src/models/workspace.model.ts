import mongoose from "mongoose";

const WORKSPACE_ROLES = ["owner", "member", "viewer"];

const workspaceShema = new mongoose.Schema(
  {
    name: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        role: { type: String, enum: WORKSPACE_ROLES, default: "member" },
      },
    ],

    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
  },
  { timestamps: true },
);
