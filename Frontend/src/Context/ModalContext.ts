import { createContext, useContext } from "react";
import type { ModalProps } from "../interface";

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
