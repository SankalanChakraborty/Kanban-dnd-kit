import { DragDropProvider } from "@dnd-kit/react";
import "./App.css";
import Column from "./Components/Column";
import type { column } from "./interface";
import Search from "./Components/Search";
import TaskContextProvider from "./Context/TaskContextProvider";
import { v4 as uuidv4 } from "uuid";

function App() {
  const columns: column[] = [
    {
      id: String(uuidv4()),
      title: "to do",
      tasks: [],
    },
    {
      id: String(uuidv4()),
      title: "in progress",
      tasks: [],
    },
    {
      id: String(uuidv4()),
      title: "done",
      tasks: [],
    },
  ];

  return (
    <TaskContextProvider>
      <div className="container w-full h-full bg-slate-900 py-8 px-16 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-slate-100">Kanban board</h1>
        <Search />
        <DragDropProvider>
          <div className="columns-container px-8 flex justify-center items-center gap-4 h-full">
            {columns.map((column) => (
              <Column key={column.id} column={column} />
            ))}
          </div>
        </DragDropProvider>
      </div>
    </TaskContextProvider>
  );
}

export default App;
