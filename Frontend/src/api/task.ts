import type { Task } from "../interface";
import { authenticatedFetch } from "./authenticatedFetch";

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
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/get-tasks`, {
      method: "GET",
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to fetch tasks (${response.status})${errorBody ? `: ${errorBody}` : ""}`,
      );
    }

    return response.json();
  } catch (error) {
    throw new Error(
      `Could not fetch tasks: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
};

export const createTask = async (task: Task): Promise<CreateTaskResponse> => {
  try {
    const { headers } = getApiHeaders();
    const response = await authenticatedFetch(`${API_BASE_URL}/create-task`, {
      method: "POST",
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
  } catch (error) {
    throw new Error(
      `Could not create task: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
};

export const updateTask = async (task: Task): Promise<TaskResponse> => {
  try {
    const { headers } = getApiHeaders();
    const { id } = task;
    const response = await authenticatedFetch(
      `${API_BASE_URL}/update-task/${id}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(task),
      },
    );
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to update task (${response.status})${errorBody ? `: ${errorBody}` : ""}`,
      );
    }
    return response.json();
  } catch (error) {
    throw new Error(
      `Could not update task: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
};
