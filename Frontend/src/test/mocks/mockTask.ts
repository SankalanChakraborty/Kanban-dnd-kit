import type { Task } from "../../interface";

export const mockTask: Task = {
  id: "1",
  title: "Sample task",
  description: "Sample description",
  status: "to do",
  priority: "low",
  createdAt: "13 September 2026",
  columnId: "todo",
};

export const mockTaskWithoutDescription: Task = {
  ...mockTask,
  description: undefined,
};

export const mockTaskDone: Task = {
  ...mockTask,
  status: "done",
};
