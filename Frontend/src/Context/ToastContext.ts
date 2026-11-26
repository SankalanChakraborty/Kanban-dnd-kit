import { createContext, useContext } from "react";
import type { ToastContextValue } from "../interface";

const ToastContext = createContext<ToastContextValue | null>(null);

const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within ToastContextProvider");
  }
  return context;
};

export default ToastContext;
export { useToastContext };
