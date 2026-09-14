import TaskContext from "./TaskContext";
import type { Task } from "../interface";
import { useState } from "react";

const TaskContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <TaskContext.Provider
      value={{ tasks, setTasks, selectedTask, setSelectedTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContextProvider;
