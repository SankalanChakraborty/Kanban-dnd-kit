import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { useTaskContext } from "../Context/TaskContext";
import { useModalContext } from "../Context/ModalContext";
import Search from "./Search";
import EditCardModal from "./EditCardModal";
import Column from "./Column";
import type { ColumnType, Task } from "../interface";
import { useUserContext } from "../Context/UserContext";
import Spinner from "./Spinner";
import { updateTask } from "../api/task";

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

const Homepage = () => {
  const { isAuthenticated, isLoading } = useUserContext();
  const { tasks, setTasks, selectedTask } = useTaskContext();
  const { isModalOpen } = useModalContext();

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-[linear-gradient(135deg,#020617_0%,#0f172a_55%,#1e293b_100%)]">
        <Spinner />
      </div>
    );
  }

  const handleDragEnd = async (event: DragEndEvent) => {
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
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask: Task = {
      ...taskToUpdate,
      columnId: newColumnId,
      status: newTaskStatus.title,
    };
    const data = await updateTask(updatedTask);
    console.log(data);
  };

  return (
    isAuthenticated && (
      <div className="app-container w-full min-h-screen bg-[linear-gradient(135deg,#020617_0%,#0f172a_55%,#1e293b_100%)] py-4 px-4 sm:py-6 sm:px-8 lg:py-8 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {isModalOpen ? <EditCardModal key={selectedTask?.id} /> : null}
          <h1 className="app-heading text-4xl font-bold text-slate-100">
            Kanban board
          </h1>
          <Search />
          <DragDropProvider onDragEnd={handleDragEnd}>
            <div className="columns-container grid grid-cols-1 gap-6 md:grid-cols-3 items-start">
              {columns.map((column) => (
                <Column key={column.id} column={column} />
              ))}
            </div>
          </DragDropProvider>
        </div>
      </div>
    )
  );
};

export default Homepage;
