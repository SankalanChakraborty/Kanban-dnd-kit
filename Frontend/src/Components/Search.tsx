import { useState } from "react";
import Button from "./Button";
import { useTaskContext } from "../Context/TaskContext";
import type { Task, TaskPriority } from "../interface";
import { createTask } from "../api/task";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Search = () => {
  const [taskValue, setTaskValue] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const { setTasks } = useTaskContext();

  const taskValueChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTaskValue(event.target.value);
  };

  const taskDescriptionChangehandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTaskDescription(event.target.value);
  };

  const taskPriorityChangeHandler = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setTaskPriority(event.target.value as "low" | "medium" | "high");
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskValue) return;

    const newTask: Task = {
      id: String(Date.now()),
      title: taskValue,
      description: taskDescription,
      status: "to do",
      priority: taskPriority,
      dueDate: dueDate?.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      createdAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      columnId: "todo",
    };
    const { task } = await createTask(newTask);

    setTasks((currentTasks) => [...currentTasks, task]);
    setTaskValue("");
    setTaskDescription("");
    setTaskPriority("low");
  };

  return (
    <form
      className="w-full p-4 sm:p-5 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-slate-800 shadow-xl shadow-black/20 grid grid-cols-1 justify-between sm:grid-cols-2 xl:flex xl:items-end gap-3.5"
      onSubmit={submitHandler}
    >
      {/* Task Title */}
      <div className="flex flex-col gap-1.5 w-full xl:flex-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          Task title
        </span>
        <input
          className="w-full py-2.5 px-3.5 text-xs text-slate-100 placeholder-slate-500 bg-slate-800/60 border border-slate-700/70 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
          type="text"
          value={taskValue}
          placeholder="Add a task title..."
          onChange={taskValueChangeHandler}
          data-testid="task-name"
        />
      </div>

      {/* Task Description */}
      <div className="flex flex-col gap-1.5 w-full xl:flex-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          Task description
        </span>
        <input
          className="w-full py-2.5 px-3.5 text-xs text-slate-100 placeholder-slate-500 bg-slate-800/60 border border-slate-700/70 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
          type="text"
          value={taskDescription}
          placeholder="Task description (optional)..."
          onChange={taskDescriptionChangehandler}
          data-testid="task-description"
        />
      </div>

      {/* Priority Select */}
      <div className="flex flex-col gap-1.5 w-full sm:w-auto xl:w-44">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          Priority
        </span>
        <select
          className="w-full py-2.5 px-3 rounded-xl bg-slate-800/60 border border-slate-700/70 text-slate-200 text-xs font-medium outline-none cursor-pointer focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
          value={taskPriority}
          onChange={taskPriorityChangeHandler}
        >
          <option value="low" className="bg-slate-900 text-slate-200">
            Low Priority
          </option>
          <option value="medium" className="bg-slate-900 text-slate-200">
            Medium Priority
          </option>
          <option value="high" className="bg-slate-900 text-slate-200">
            High Priority
          </option>
        </select>
      </div>

      {/* Due Date Picker */}
      <div className="flex flex-col gap-1.5 w-full sm:w-auto xl:w-40 [&>.react-datepicker-wrapper]:w-full">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          Due date
        </span>
        <DatePicker
          className="w-full py-2.5 px-3 rounded-xl bg-slate-800/60 border border-slate-700/70 text-slate-200 text-xs font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
          selected={dueDate}
          onChange={(date: Date | null) => setDueDate(date)}
        />
      </div>

      {/* Submit Button */}

      <div className="w-full sm:col-span-2 xl:col-span-1 xl:w-auto pt-2 sm:pt-0 flex justify-end xl:block">
        <Button buttonType="submit">Add Item</Button>
      </div>
    </form>
  );
};

export default Search;
