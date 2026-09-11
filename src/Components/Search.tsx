import { useState } from "react";

const Search = () => {
  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className="w-full">
      <input
        className="w-full py-2 px-4 bg-gray-100 outline-none border-0 rounded-lg hover:bg-gray-300 transition-all ease-in-out"
        type="text"
        value={searchValue}
        onChange={searchChangeHandler}
      />
    </div>
  );
};

export default Search;
