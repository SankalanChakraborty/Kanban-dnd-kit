import React from "react";

const Columns = () => {
  return (
    <div className="columns-container flex justify-center items-center gap-4 h-full">
      <div className="todo-col flex-1 h-full p-6 bg-black rounded-md flex flex-col">
        <div className="column-heade flex justify-between">
          <span className="text-white text-lg"> To do</span>
          <button className="text-white text-xl">+</button>
        </div>
      </div>

      <div className="in-progress-col flex-1 h-full p-6 bg-black rounded-md flex flex-col">
        <div className="column-heade flex justify-between">
          <span className="text-white text-lg">In Progress</span>
          <button className="text-white text-xl">+</button>
        </div>
      </div>
      <div className="done-col flex-1 h-full p-6 bg-black rounded-md flex flex-col">
        <div className="column-heade flex justify-between">
          <span className="text-white text-lg"> Done</span>
          <button className="text-white text-xl">+</button>
        </div>
      </div>
    </div>
  );
};

export default Columns;
