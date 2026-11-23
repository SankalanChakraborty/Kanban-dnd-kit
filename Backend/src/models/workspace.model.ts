import mongoose from "mongoose";

const WORKSPACE_ROLES = ["owner", "member", "viewer"] as const;

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        _id: false,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
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

workspaceSchema.index({ "members.user": 1 });
workspaceSchema.index({ owner: 1, name: 1 }, { unique: true });

const Workspace = mongoose.model("Workspace", workspaceSchema);
export default Workspace;
