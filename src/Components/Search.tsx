import { useState } from "react";
import Button from "./Button";
import { useTaskContext } from "../Context/TaskContext";
import type { Task } from "../interface";
import { v4 as uuidv4 } from "uuid";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const { setTasks } = useTaskContext();
  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const clickHandler = () => {
    if (!searchValue) return;

    const newTask: Task = {
      id: String(uuidv4()),
      title: searchValue,
      status: "todo",
      priority: "low",
      createdAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
    setTasks((prevtasks) => [...prevtasks, newTask]);
    setSearchValue("");
  };

  return (
    <div className="w-full flex gap-2">
      <input
        className="w-2xs py-2 px-4 bg-slate-800 text-slate-100 placeholder-slate-500 outline-none border border-slate-700 rounded-lg transition-all ease-in-out focus:border-blue-500 focus:shadow-sm focus:shadow-blue-900"
        type="text"
        value={searchValue}
        placeholder="Add a todo item..."
        onChange={searchChangeHandler}
      />
      <Button onClick={clickHandler}>Add Item</Button>
    </div>
  );
};

export default Search;
