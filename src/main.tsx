import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import TaskContextProvider from "./Context/TaskContextProvider.tsx";
import ModalContextProvider from "./Context/ModalContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskContextProvider>
      <ModalContextProvider>
        <App />
      </ModalContextProvider>
    </TaskContextProvider>
  </StrictMode>,
);
