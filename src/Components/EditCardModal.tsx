import { useModalContext } from "../Context/ModalContext";
import { useTaskContext } from "../Context/TaskContext";
import getPriorityBgColor from "../utils/getPriorityBgColor";
import { RxCrossCircled } from "react-icons/rx";
import { useState } from "react";
import DatePicker from "react-datepicker";
import type { TaskPriority } from "../interface";

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

  const closeModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const handleSave = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === selectedTask?.id
          ? {
              ...task,
              title: newTaskTitle,
              description: newTaskDesc,
              priority: newTaskPriority,
              dueDate: newDueDate?.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            }
          : task,
      ),
    );
    closeModal();
  };

  return (
    <div className="modal-container flex flex-col justify-center items-center absolute top-0 left-0 w-full h-full p-4 sm:p-8 bg-gray-950/70">
      <div className="edit-card bg-gray-950 w-full max-w-lg max-h-[85vh] overflow-y-auto px-8 py-5 rounded-xl flex flex-col gap-4 justify-center items-center">
        <div className="priority-and-close-modal flex justify-between w-full">
          <select
            className={`priority px-3 py-1 rounded-full text-[8px] text-white font-bold w-fit uppercase tracking-wider ${getPriorityBgColor(newTaskPriority || "")}`}
            value={newTaskPriority}
            onChange={handleTaskPriorityChange}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <RxCrossCircled
            className="text-lg text-blue-500 hover: cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="title-description w-full flex flex-col gap-3">
          <div className="title">
            <input
              type="text"
              className="text-white font-extrabold w-full p-2 rounded-lg outline-none focus:bg-slate-800 focus:border-2 focus:border-blue-500 transition-all ease-linear capitalize"
              value={newTaskTitle}
              onChange={handleTasKTitleChange}
            />
          </div>
          <div className="description flex flex-col gap-2">
            <span className="text-gray-400 uppercase text-xs">Description</span>
            <textarea
              className="text-gray-300 text-sm p-2 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-2 focus:border-blue-500 transition-all ease-linear"
              value={newTaskDesc}
              onChange={handleTasKDescChange}
            />
          </div>
        </div>
        <div className="ticket-status w-full flex gap-5">
          <div className="status flex flex-col gap-2">
            <span className="text-gray-400 uppercase text-xs">Status</span>
            <span className="text-white uppercase text-xs">
              {selectedTask?.status}
            </span>
          </div>
          <div className="due-date flex flex-col justify-between gap-2">
            <span className="text-gray-400 uppercase text-xs">Due Date</span>
            <DatePicker
              className="px-4 py-2 rounded-lg outline-none border border-slate-700 text-slate-100 focus:border-blue-500 focus:shadow-sm focus:shadow-blue-900 text-xs transition-all ease-linear"
              selected={newDueDate}
              onChange={(date: Date | null) => setNewDueDate(date)}
            />
          </div>
          <div className="asignee"></div>
        </div>
        <button
          className="w-[150px] bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-sm text-sm text-white font-semibold"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditCardModal;
