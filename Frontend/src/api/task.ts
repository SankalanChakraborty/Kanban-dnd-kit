import type { Task } from "../interface";

const API_BASE_URL = import.meta.env.VITE_TASK_API_BASE_URL;

interface TasksResponse {
  status: string;
  message: string;
  tasks: Task[];
}

interface TaskResponse {
  status: string;
  message: string;
  task: Task;
}

interface CreateTaskResponse {
  status: string;
  message: string;
  task: Task;
}

export const getApiHeaders = () => {
  return {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
};

export const getTasksFromDb = async (): Promise<TasksResponse> => {
  const response = await fetch(`${API_BASE_URL}/get-tasks`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to fetch tasks (${response.status})${errorBody ? `: ${errorBody}` : ""}`,
    );
  }

  return response.json();
};

export const createTask = async (task: Task): Promise<CreateTaskResponse> => {
  const { headers } = getApiHeaders();
  const response = await fetch(`${API_BASE_URL}/create-task`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to create task (${response.status})${errorBody ? `: ${errorBody}` : ""}`,
    );
  }

  return response.json();
};

export const updateTask = async (task: Task): Promise<TaskResponse> => {
  const { headers } = getApiHeaders();
  const { id } = task;
  console.log("Update task>>>>>>>>>", id);
  const response = await fetch(`${API_BASE_URL}/update-task/${id}`, {
    method: "PUT",
    credentials: "include",
    headers,
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to update task (${response.status})${errorBody ? `: ${errorBody}` : ""}`,
    );
  }
  return response.json();
};
