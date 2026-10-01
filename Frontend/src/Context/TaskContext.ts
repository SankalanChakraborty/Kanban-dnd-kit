import { createContext, useContext } from "react";
import type { Task } from "../interface";

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

const TaskContext = createContext<TaskContextType | null>(null);

const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within TaskContextProvider");
  }

  return context;
};

export default TaskContext;
export { useTaskContext };
