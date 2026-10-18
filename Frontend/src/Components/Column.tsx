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
    // <div className="status-col flex-1 h-full p-6 bg-slate-800 rounded-lg flex flex-col gap-2 border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
    //   <div className="column-header flex justify-between">
    //     <div className="flex gap-4">
    //       <span className="text-slate-200 text-sm uppercase font-semibold">
    //         {column.title}
    //       </span>
    //       <span
    //         className="bg-blue-600 flex justify-center items-center rounded-full text-[10px] w-[18px] h-[18px] text-white"
    //         data-testid="task-count"
    //       >
    //         {columnTasks.length}
    //       </span>
    //     </div>
    //     <button className="text-slate-400 text-xl hover:text-slate-300 transition-colors hover:cursor-pointer">
    //       +
    //     </button>
    //   </div>
    //   <div
    //     ref={ref}
    //     className={`card-droppable-area w-full h-full py-4 flex flex-col gap-3  ${
    //       isDropTarget
    //         ? "bg-blue-500/20 border-2 border-blue-500 border-dashed"
    //         : "border-slate-700 bg-slate-800"
    //     }`}
    //   >
    //     {columnTasks.length > 0 ? (
    //       columnTasks.map((task) => <Card key={task.id} task={task} />)
    //     ) : (
    //       <EmptyTask />
    //     )}
    //   </div>
    // </div>

    <div className="status-col flex-1 h-full p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-lg shadow-black/20 flex flex-col gap-3 transition-colors duration-200">
      {/* Column Header */}
      <div className="column-header flex items-center justify-between pb-3 border-b border-slate-800/70">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-200 text-xs font-bold uppercase tracking-wider">
            {column.title}
          </span>
          <span
            className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-[11px] font-semibold"
            data-testid="task-count"
          >
            {columnTasks.length}
          </span>
        </div>
        <button
          type="button"
          className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer text-lg leading-none"
          title="Add new task"
        >
          +
        </button>
      </div>

      {/* Droppable Area */}
      <div
        ref={ref}
        className={`card-droppable-area flex-1 w-full p-2.5 rounded-xl flex flex-col gap-3 overflow-y-auto transition-all duration-200 min-h-[160px] ${
          isDropTarget
            ? "bg-indigo-500/10 border-2 border-dashed border-indigo-500/60 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]"
            : "bg-slate-950/40 border border-transparent"
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
