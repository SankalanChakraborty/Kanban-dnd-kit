import { createContext, useContext } from "react";
import type { ColumnType } from "../interface";

interface ModalProps {
  isEditCardModalOpen: boolean;
  setIsEditCardModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addTaskColumn: ColumnType | null;
  setAddTaskColumn: React.Dispatch<React.SetStateAction<ColumnType | null>>;
}

const ModalContext = createContext<ModalProps | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within ModalContextProvider");
  }
  return context;
};

export default ModalContext;
export { useModalContext };
