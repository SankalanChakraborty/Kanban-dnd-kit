import { useModalContext } from "../Context/ModalContext";
import { useTaskContext } from "../Context/TaskContext";
import getPriorityBgColor from "../utils/getPriorityBgColor";
import { RxCrossCircled } from "react-icons/rx";
import { useState } from "react";
import DatePicker from "react-datepicker";
import type { Task, TaskPriority } from "../interface";
import { updateTask } from "../api/task";

const EditCardModal = () => {
  const { selectedTask, setSelectedTask, setTasks } = useTaskContext();
  const { setIsModalOpen } = useModalContext();
  const [newTaskTitle, setNewTaskTitle] = useState(selectedTask?.title ?? "");
  const [newTaskDesc, setNewTaskDesc] = useState(
    selectedTask?.description ?? "",
  );
  const [newDueDate, setNewDueDate] = useState<Date | null>(
    selectedTask?.dueDate ? new Date(selectedTask.dueDate) : null,
  );
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>(
    selectedTask?.priority ?? "low",
  );
  const [newColumnId, setNewColumnId] = useState(
    selectedTask?.columnId ?? "todo",
  );

  const handleTasKTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.target.value);
  };

  const handleTasKDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTaskDesc(e.target.value);
  };

  const handleTaskPriorityChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setNewTaskPriority(e.target.value as TaskPriority);
  };

  const handleColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewColumnId(e.target.value);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!selectedTask) return;

    const statusByColumnId: Record<Task["columnId"], Task["status"]> = {
      todo: "to do",
      "in-progress": "in progress",
      done: "done",
    };
    const updatedTask = {
      ...selectedTask,
      title: newTaskTitle,
      description: newTaskDesc,
      priority: newTaskPriority,
      dueDate:
        newDueDate?.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }) ?? "",
      columnId: newColumnId,
      status: statusByColumnId[newColumnId] ?? selectedTask.status,
    };

    const data = await updateTask(updatedTask);
    setTasks((tasks) =>
      tasks.map((task) => (task.id === data.task.id ? data.task : task)),
    );
    closeModal();
  };

  return (
    <div className="modal-container fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="edit-card relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-700/70 shadow-2xl shadow-black/60 flex flex-col gap-6">
        {/* Header: Priority & Close */}
        <div className="priority-and-close-modal flex items-center justify-between w-full">
          <div className="relative">
            <select
              className={`priority appearance-none cursor-pointer px-3.5 py-1.5 pr-7 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white border border-white/10 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${getPriorityBgColor(newTaskPriority || "")}`}
              value={newTaskPriority}
              onChange={handleTaskPriorityChange}
            >
              <option value="low" className="bg-slate-900 text-white">
                Low Priority
              </option>
              <option value="medium" className="bg-slate-900 text-white">
                Medium Priority
              </option>
              <option value="high" className="bg-slate-900 text-white">
                High Priority
              </option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-white/70">
              ▼
            </span>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RxCrossCircled className="text-2xl hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Title & Description Fields */}
        <div className="title-description w-full flex flex-col gap-4">
          <div className="title">
            <input
              type="text"
              placeholder="Task title..."
              className="w-full text-xl font-bold text-white placeholder-slate-500 bg-slate-800/60 border border-slate-700/70 rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={newTaskTitle}
              onChange={handleTasKTitleChange}
            />
          </div>

          <div className="description flex flex-col gap-1.5">
            <span className="text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
              Description
            </span>
            <textarea
              rows={4}
              placeholder="Add more details about this task..."
              className="w-full text-sm text-slate-200 placeholder-slate-500 bg-slate-800/60 border border-slate-700/70 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none leading-relaxed"
              value={newTaskDesc}
              onChange={handleTasKDescChange}
            />
          </div>
        </div>

        {/* Meta Controls (Status, Due Date, Assignee) */}
        <div className="ticket-status w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="status flex flex-col gap-1.5">
            <span className="text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
              Status
            </span>
            <select
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-slate-200 text-xs font-medium outline-none cursor-pointer focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={newColumnId}
              onChange={handleColumnChange}
            >
              <option value="todo" className="bg-slate-900 text-slate-200">
                To Do
              </option>
              <option
                value="in-progress"
                className="bg-slate-900 text-slate-200"
              >
                In Progress
              </option>
              <option value="done" className="bg-slate-900 text-slate-200">
                Done
              </option>
            </select>
          </div>

          <div className="due-date flex flex-col gap-1.5">
            <span className="text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
              Due Date
            </span>
            <DatePicker
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-slate-200 text-xs font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              selected={newDueDate}
              onChange={(date: Date | null) => setNewDueDate(date)}
            />
          </div>
          <div className="asignee"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCardModal;
