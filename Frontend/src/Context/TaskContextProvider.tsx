import TaskContext from "./TaskContext";
import type { Task } from "../interface";
import { useState, useEffect } from "react";
import { getTasksFromDb } from "../api/task";
import { useUserContext } from "./UserContext";

const TaskContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { isAuthenticated } = useUserContext();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchTasks = async () => {
      try {
        const data = await getTasksFromDb();
        setTasks(data.tasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    void fetchTasks();
  }, [isAuthenticated]);

  return (
    <TaskContext.Provider
      value={{ tasks, setTasks, selectedTask, setSelectedTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContextProvider;
