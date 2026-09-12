export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "to do" | "in progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  assignee?: { name: string; avatarColor: string };
  createdAt: string;
}

type columnType = "to do" | "in progress" | "done";
export interface column {
  id: string;
  title: columnType;
  tasks: Task[] | [];
}
