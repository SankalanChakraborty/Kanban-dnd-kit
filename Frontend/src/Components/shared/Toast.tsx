import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import type { ToastProps } from "../../interface";

const Toast = ({ message, type, onClose }: ToastProps) => {
  if (!message.trim()) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-fit px-4 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium backdrop-blur-md transition-all animate-bounce-short ${
          type === "success"
            ? "bg-white/95 dark:bg-slate-900/95 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
            : type === "error"
              ? "bg-white/95 dark:bg-slate-900/95 border-rose-500/40 text-rose-800 dark:text-rose-300"
              : "bg-white/95 dark:bg-slate-900/95 border-indigo-500/40 text-indigo-800 dark:text-indigo-300"
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {type === "success" && (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          )}
          {type === "error" && (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          {type === "info" && (
            <Info className="w-5 h-5 text-indigo-500 shrink-0" />
          )}
          <span className="truncate">{message}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
