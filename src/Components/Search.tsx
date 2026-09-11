import { useState } from "react";
import Button from "./Button";

const Search = () => {
  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className="w-full flex gap-2">
      <input
        className="w-2xs py-2 px-4 bg-slate-800 text-slate-100 placeholder-slate-500 outline-none border border-slate-700 rounded-lg transition-all ease-in-out focus:border-blue-500 focus:shadow-sm focus:shadow-blue-900"
        type="text"
        value={searchValue}
        placeholder="Add a todo item..."
        onChange={searchChangeHandler}
      />
      <Button>Add Item</Button>
    </div>
  );
};

export default Search;
