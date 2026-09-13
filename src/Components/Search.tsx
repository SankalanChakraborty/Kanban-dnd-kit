import { useState } from "react";
import Button from "./Button";
import { useTaskContext } from "../Context/TaskContext";
import type { Task } from "../interface";

const Search = () => {
  const [taskValue, setTaskValue] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">(
    "medium",
  );
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

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskValue) return;

    const newTask: Task = {
      id: String(Date.now()),
      title: taskValue,
      description: taskDescription,
      status: "to do",
      priority: taskPriority,
      createdAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      columnId: "todo",
    };
    setTasks((prevtasks) => [...prevtasks, newTask]);
    setTaskValue("");
    setTaskDescription("");
    setTaskPriority("low");
  };

  return (
    <form className="w-full flex gap-2" onSubmit={submitHandler}>
      <input
        className="w-2xs py-2 px-4 text-sm bg-slate-800 text-slate-100 placeholder-slate-500 outline-none border border-slate-700 rounded-lg transition-all ease-in-out focus:border-blue-500 focus:shadow-sm focus:shadow-blue-900"
        type="text"
        value={taskValue}
        placeholder="Add a Task item..."
        onChange={taskValueChangeHandler}
        data-testid="task-name"
      />

      <input
        className="w-2xs py-2 px-4 text-sm bg-slate-800 text-slate-100 placeholder-slate-500 outline-none border border-slate-700 rounded-lg transition-all ease-in-out focus:border-blue-500 focus:shadow-sm focus:shadow-blue-900"
        type="text"
        value={taskDescription}
        placeholder="Task Description..."
        onChange={taskDescriptionChangehandler}
        data-testid="task-description"
      />

      <select
        className="px-4 py-2 rounded-lg outline-none border border-slate-700 text-slate-100 focus:border-blue-500 focus:shadow-sm focus:shadow-blue-900 text-xs"
        value={taskPriority}
        onChange={taskPriorityChangeHandler}
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>

      <Button buttonType="submit">Add Item</Button>
    </form>
  );
};

export default Search;
