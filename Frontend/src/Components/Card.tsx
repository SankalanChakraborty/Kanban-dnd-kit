import type { Task } from "../interface";
import { CiCalendarDate } from "react-icons/ci";
import { useDraggable } from "@dnd-kit/react";
import { useTaskContext } from "../Context/TaskContext";
import { useModalContext } from "../Context/ModalContext";
import getPriorityBgColor from "../utils/getPriorityBgColor";

interface CardProps {
  task: Task;
}

const Card = ({ task }: CardProps) => {
  const { setSelectedTask } = useTaskContext();
  const { setIsModalOpen } = useModalContext();

  const { ref } = useDraggable({
    id: task.id,
  });

  const shortDesc = task.description?.substring(0, 45) + "...";

  const handleCardClick = () => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div
      className="card-container group relative flex flex-col justify-between w-64 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-lg shadow-black/30 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:cursor-grab active:cursor-grabbing transition-all duration-300 ease-out"
      ref={ref}
      onClick={handleCardClick}
    >
      {/* Subtle top-edge accent glow on hover */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col gap-3">
        {task.status !== "done" ? (
          <span
            className={`priority px-2.5 py-0.5 rounded-full text-[10px] font-semibold w-fit tracking-wide uppercase border border-white/10 shadow-sm ${getPriorityBgColor(
              task.priority,
            )}`}
          >
            {task.priority}
          </span>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <h1
            className={`task-title text-base font-semibold tracking-tight transition-colors duration-200 ${
              task.status === "done"
                ? "line-through text-slate-500"
                : "text-slate-100 group-hover:text-white"
            }`}
          >
            {task.title}
          </h1>
          {task.description && (
            <span className="task-description text-xs text-slate-400/90 leading-relaxed line-clamp-2">
              {task.description.length > 40 ? shortDesc : task.description}
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
        <CiCalendarDate
          size={15}
          className="text-slate-500 group-hover:text-indigo-400 transition-colors duration-200"
        />
        <span>{task.dueDate}</span>
      </div>
    </div>
  );
};

export default Card;
