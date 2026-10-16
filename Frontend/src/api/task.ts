import type { Task } from "../interface";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getApiHeaders = () => {
  return {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
};

export const getTasks = async (): Promise<Task> => {
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

export const createTask = async (task: Task): Promise<Task> => {
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
