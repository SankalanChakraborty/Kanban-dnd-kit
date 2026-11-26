import { createContext, useContext } from "react";
import type { UserContextType } from "../interface";

const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserContextProvider");
  }

  return context;
};

export default UserContext;
