import { useEffect, useState } from "react";
import Toast from "../Components/shared/Toast";
import ToastContext from "./ToastContext";
import type { ToastState, ToastType } from "../interface";

const ToastContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  return (
    <ToastContext.Provider
      value={{ showToast, hideToast: () => setToast(null) }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
};

export default ToastContextProvider;
