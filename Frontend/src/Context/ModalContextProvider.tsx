import { useState } from "react";
import ModalContext from "./ModalContext";
import type { ColumnType } from "../interface";

const ModalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [addTaskColumn, setAddTaskColumn] = useState<ColumnType | null>(null);

  const [isCreateWorkSpaceModalOpen, setIsCreateWorkspaceModalOpen] =
    useState(false);

  return (
    <ModalContext.Provider
      value={{
        isEditCardModalOpen,
        setIsEditCardModalOpen,
        isAddTaskModalOpen,
        setIsAddTaskModalOpen,
        addTaskColumn,
        setAddTaskColumn,
        isCreateWorkSpaceModalOpen,
        setIsCreateWorkspaceModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
