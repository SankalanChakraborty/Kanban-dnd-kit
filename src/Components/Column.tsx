import { useTaskContext } from "../Context/TaskContext";
import Card from "./Card";
import type { ColumnType } from "../interface";
import { useDroppable } from "@dnd-kit/react";
import EmptyTask from "./EmptyTask";

interface columnProps {
  column: ColumnType;
}

const Column = ({ column }: columnProps) => {
  const { tasks } = useTaskContext();

  const { isDropTarget, ref } = useDroppable({ id: column.id });

  const columnTasks = tasks.filter((task) => task.columnId === column.id);

  return (
    <div className="status-col flex-1 h-full p-6 bg-slate-800 rounded-lg flex flex-col gap-2 border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="column-heade flex justify-between">
        <div className="flex gap-4">
          <span className="text-slate-200 text-sm uppercase font-semibold">
            {column.title}
          </span>
          <span className="bg-blue-600 flex justify-center items-center rounded-full text-[10px] w-[18px] h-[18px] text-white">
            {columnTasks.length}
          </span>
        </div>
        <button className="text-slate-400 text-xl hover:text-slate-300 transition-colors hover:cursor-pointer">
          +
        </button>
      </div>
      <div
        ref={ref}
        className={`card-droppable-area w-full h-full py-4 flex flex-col gap-3  ${
          isDropTarget
            ? "bg-blue-500/20 border-2 border-blue-500 border-dashed"
            : "border-slate-700 bg-slate-800"
        }`}
      >
        {columnTasks.length > 0 ? (
          columnTasks.map((task) => <Card key={task.id} task={task} />)
        ) : (
          <EmptyTask />
        )}
      </div>
    </div>
  );
};

export default Column;
