import { useState, useEffect } from "react";
import UserContext from "./UserContext";
import { getCurrentUser } from "../api/user";

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        const data = await getCurrentUser();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
        console.error("Failed to restore user session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, isLoading, setIsLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
