import { DragDropProvider } from "@dnd-kit/react";
import type { DragEndEvent } from "@dnd-kit/react";
import Column from "./Components/Column";
import type { ColumnType } from "./interface";
import Search from "./Components/Search";
import { useTaskContext } from "./Context/TaskContext";
import { useModalContext } from "./Context/ModalContext";
import EditCardModal from "./Components/EditCardModal";

const columns: ColumnType[] = [
  {
    id: "todo",
    title: "to do",
  },
  {
    id: "in-progress",
    title: "in progress",
  },
  {
    id: "done",
    title: "done",
  },
];
function App() {
  const { setTasks, selectedTask } = useTaskContext();
  const { isModalOpen } = useModalContext();

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;
    const { operation } = event;
    const { source, target } = operation;
    if (!source || !target) return;

    const taskId = String(source.id);
    const newColumnId = String(target.id);
    const newTaskStatus = columns.find((col) => col.id === newColumnId);

    if (!newTaskStatus) return;

    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        return task.id === taskId
          ? {
              ...task,
              columnId: newColumnId,
              status: newTaskStatus?.title,
            }
          : task;
      });
    });
  };

  return (
    <div className="container w-full h-full bg-slate-900 py-8 px-16 flex flex-col gap-8">
      {isModalOpen ? <EditCardModal key={selectedTask?.id} /> : null}
      <h1 className="app-heading text-4xl font-bold text-slate-100">
        Kanban board
      </h1>
      <Search />
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="columns-container px-8 flex justify-center items-center gap-4 h-full">
          {columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </div>
      </DragDropProvider>
    </div>
  );
}

export default App;
