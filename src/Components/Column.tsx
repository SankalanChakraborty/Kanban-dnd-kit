import { useTaskContext } from "../Context/TaskContext";
import Card from "./Card";
import type { column } from "../interface";
import { useDroppable } from "@dnd-kit/react";

interface columnProps {
  column: column;
}

const Column = ({ column }: columnProps) => {
  const { tasks } = useTaskContext();
  const { isDropTarget, ref } = useDroppable({ id: column.id });

  return (
    <div className="todo-col flex-1 h-full p-6 bg-slate-800 rounded-lg flex flex-col border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="column-heade flex justify-between">
        <span className="text-slate-200 text-sm uppercase font-semibold">
          {column.title}
        </span>
        <button className="text-slate-400 text-xl hover:text-slate-300 transition-colors">
          +
        </button>
      </div>
      <div ref={ref} className="card-droppable-area w-full h-full py-4">
        {tasks.map((task) =>
          task.status === column.title ? (
            <Card key={task.id} task={task} />
          ) : null,
        )}
      </div>
    </div>
  );
};

export default Column;
