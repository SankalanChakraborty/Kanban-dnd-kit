import mongoose from "mongoose";

const TASK_STATUSES = ["to do", "in progress", "done"];
const TASK_PRIORITIES = ["low", "medium", "high"];

const assigneeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatarColor: { type: String, required: true },
  },
  { _id: false }, // no separate _id for the embedded object
);

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: "to do",
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: "low",
    },
    dueDate: { type: String },
    assignee: { type: assigneeSchema },
    columnId: { type: String, required: true },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
