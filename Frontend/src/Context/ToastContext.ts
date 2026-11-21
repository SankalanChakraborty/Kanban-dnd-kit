import { createContext, useContext } from "react";
import type { ToastType } from "../Components/shared/Toast";

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

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
