import { DragDropProvider } from "@dnd-kit/react";
import "./App.css";
import Columns from "./Components/Columns";
import Search from "./Components/Search";
import TaskContextProvider from "./Context/TaskContextProvider";

function App() {
  return (
    <TaskContextProvider>
      <div className="container w-full h-full bg-slate-900 py-8 px-16 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-slate-100">Kanban board</h1>
        <Search />
        <DragDropProvider>
          <Columns />
        </DragDropProvider>
      </div>
    </TaskContextProvider>
  );
}

export default App;
