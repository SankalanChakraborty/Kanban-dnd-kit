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
        className="w-2xs py-2 px-4 bg-gray-100 outline-none border-0 rounded-lg transition-all ease-in-out"
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
