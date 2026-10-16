import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import TaskContextProvider from "./Context/TaskContextProvider.tsx";
import ModalContextProvider from "./Context/ModalContextProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskContextProvider>
      <ModalContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ModalContextProvider>
    </TaskContextProvider>
  </StrictMode>,
);
