import { useState } from "react";
import Button from "./Button";
import { useAppSelector } from "../../redux/store/hooks";
import type { RootState } from "../../redux/store/store";
import { useModalContext } from "../../Context/ModalContext";

const Dropdown = () => {
  const { setIsCreateWorkspaceModalOpen } = useModalContext();
  const createWorkspaceHandler = () => {
    setIsCreateWorkspaceModalOpen(true);
  };
  const user = useAppSelector((s: RootState) => s.user.user);
  return (
    <div className="flex flex-col p-3 bg-[#0B1220] border border-slate-700/70 w-[300px] rounded-lg absolute top--15 right-8 z-40">
      <div className="flex flex-col p-3 border-b-2 border-slate-700/70 gap-1">
        <h2 className="text-md text-slate-300 font-semibold">{user?.name}</h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {user?.email}
        </span>
      </div>
      <div className="p-2">
        <Button
          buttonStyle="tertiary"
          type={"submit"}
          additionalStyles={"px-2! py-2! w-full text-left"}
          onClick={createWorkspaceHandler}
        >
          + Create Workspace
        </Button>
        <a className="text=sm text-red-400 cursor-pointer" href="#">
          Sign out
        </a>
      </div>
    </div>
  );
};

const UserDropdown = () => {
  const user = useAppSelector((s: RootState) => s.user.user);
  const [showDropDown, setShowDropdown] = useState(false);

  const showDropdownHandler = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="relative">
      <div
        className="user-badging w-15 h-fit px-2 py-1 flex gap-3 justify-center items-center border-2 border-slate-700/70 hover:border-indigo-700 rounded-full cursor-pointer transition-all"
        onClick={showDropdownHandler}
      >
        <div className="user-initials w-7 h-7 rounded-full flex justify-center items-center shrink-0 text-sm text-slate-100 bg-indigo-500">
          {user?.name.split("")[0]}
        </div>
        <span className="text-xs text-slate-300">˅</span>
      </div>
      {showDropDown ? <Dropdown /> : null}
    </div>
  );
};

export default UserDropdown;
