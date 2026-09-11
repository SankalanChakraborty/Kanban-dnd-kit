// import type { Task } from "../App";

// interface Column {
//   id: Task["id"];
//   title: string;
//   taskIds: string[];
// }

const Columns = () => {
  return (
    <div className="columns-container flex justify-center items-center gap-4 h-full">
      <div className="todo-col flex-1 h-full p-6 bg-slate-800 rounded-lg flex flex-col border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="column-heade flex justify-between">
          <span className="text-slate-200 text-lg font-semibold"> To do</span>
          <button className="text-slate-400 text-xl hover:text-slate-300 transition-colors">+</button>
        </div>
        <div className="card-droppable-area w-full h-full"></div>
      </div>

      <div className="in-progress-col flex-1 h-full p-6 bg-slate-800 rounded-lg flex flex-col border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="column-heade flex justify-between">
          <span className="text-slate-200 text-lg font-semibold">In Progress</span>
          <button className="text-slate-400 text-xl hover:text-slate-300 transition-colors">+</button>
        </div>
        <div className="card-droppable-area w-full h-full"></div>
      </div>
      <div className="done-col flex-1 h-full p-6 bg-slate-800 rounded-lg flex flex-col border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="column-heade flex justify-between">
          <span className="text-slate-200 text-lg font-semibold"> Done</span>
          <button className="text-slate-400 text-xl hover:text-slate-300 transition-colors">+</button>
        </div>
        <div className="card-droppable-area w-full h-full"></div>
      </div>
    </div>
  );
};

export default Columns;
