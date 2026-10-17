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
    const fetchTasks = async () => {
      const data = await getTasksFromDb();
      console.log(data);
      setTasks(data.tasks);
    };
    fetchTasks();
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
