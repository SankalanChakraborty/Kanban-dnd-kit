type TaskType = "to do" | "in progress" | "done";
type TaskPriority = "low" | "medium" | "high";
export interface ColumnType {
  id: string;
  title: TaskType;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskType;
  priority: TaskPriority;
  dueDate?: string;
  assignee?: { name: string; avatarColor: string };
  createdAt: string;
  columnId: ColumnType["id"];
}
