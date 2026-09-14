import { ImFileEmpty } from "react-icons/im";
const EmptyTask = () => {
  return (
    <div className="empty-task-container h-100 flex flex-col justify-center items-center gap-3">
      <ImFileEmpty className="text-slate-300" />
      <div className="description flex flex-col justify-center items-center">
        <span className="font-medium text-sm text-slate-200">No tasks yet</span>
        <span className="text-slate-400">
          Drag a card here or click + to add one
        </span>
      </div>
    </div>
  );
};

export default EmptyTask;
