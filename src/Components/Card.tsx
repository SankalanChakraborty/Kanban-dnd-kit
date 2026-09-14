import type { Task } from "../interface";
import { CiCalendarDate } from "react-icons/ci";
import { useDraggable } from "@dnd-kit/react";

interface CardProps {
  task: Task;
}

const Card = ({ task }: CardProps) => {
  const shortDesc = task.description?.substring(0, 45) + "...";

  const { ref } = useDraggable({
    id: task.id,
  });

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-emerald-300";
      case "medium":
        return "bg-amber-500";
      case "high":
        return "bg-rose-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div
      className="card-container py-5 px-3 flex flex-col gap-4 w-56 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700 hover:border-slate-600 hover:shadow-xl hover:cursor-grab transition-all duration-300"
      ref={ref}
    >
      <span
        className={`priority px-3 py-1 rounded-full text-[8px] text-white font-bold w-fit uppercase tracking-wider ${getPriorityBgColor(task.priority)} `}
      >
        {task.priority}
      </span>
      <div className="flex flex-col gap-2">
        <h1
          className={`task-title text-lg font-bold text-white leading-tight ${task.status === "done" ? "line-through" : ""}`}
        >
          {task.title}
        </h1>
        {task.description && (
          <span className="task-description text-slate-400 text-xs leading-relaxed">
            {task.description.length > 40 ? shortDesc : task.description}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-slate-400 text-xs">
        <CiCalendarDate size={16} />
        <span>{task.createdAt}</span>
      </div>
    </div>
  );
};

export default Card;
