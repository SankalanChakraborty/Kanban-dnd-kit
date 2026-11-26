import { createContext, useContext } from "react";
import type { TaskContextType } from "../interface";

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
