import { useTaskContext } from "../Context/TaskContext";
import type { Task } from "../interface";
import { CiCalendarDate } from "react-icons/ci";

const Cards = () => {
  const { tasks } = useTaskContext();

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-emerald-500";
      case "medium":
        return "bg-amber-500";
      case "high":
        return "bg-rose-500";
      default:
        return "bg-slate-500";
    }
  };

  return tasks.map((task: Task) => (
    <div
      key={task.id}
      className="card-container p-5 flex flex-col gap-4 w-56 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700 hover:border-slate-600 hover:shadow-xl transition-all duration-300"
    >
      <span
        className={`priority px-3 py-1 rounded-full text-xs text-white font-bold w-fit uppercase tracking-wider ${getPriorityBgColor(task.priority)} `}
      >
        {task.priority}
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="task-title text-xl font-bold text-white leading-tight">
          {task.title}
        </h1>
        {task.description && (
          <span className="task-description text-slate-400 text-sm leading-relaxed">
            {task.description}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-slate-400 text-xs">
        <CiCalendarDate size={16} />
        <span>{task.createdAt}</span>
      </div>
    </div>
  ));
};

export default Cards;
