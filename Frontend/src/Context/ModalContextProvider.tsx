import { useState } from "react";
import ModalContext from "./ModalContext";
import type { ColumnType } from "../interface";

const ModalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [addTaskColumn, setAddTaskColumn] = useState<ColumnType | null>(null);

  return (
    <ModalContext.Provider
      value={{
        isEditCardModalOpen,
        setIsEditCardModalOpen,
        isAddTaskModalOpen,
        setIsAddTaskModalOpen,
        addTaskColumn,
        setAddTaskColumn,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
