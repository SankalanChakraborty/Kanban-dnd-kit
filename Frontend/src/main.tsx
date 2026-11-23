import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import TaskContextProvider from "./Context/TaskContextProvider.tsx";
import ModalContextProvider from "./Context/ModalContextProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContextProvider from "./Context/UserContextProvide.tsx";
import ToastContextProvider from "./Context/ToastContextProvider";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.ts";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserContextProvider>
      <ToastContextProvider>
        <TaskContextProvider>
          <ModalContextProvider>
            <QueryClientProvider client={queryClient}>
              <Provider store={store}>
                <App />
              </Provider>
            </QueryClientProvider>
          </ModalContextProvider>
        </TaskContextProvider>
      </ToastContextProvider>
    </UserContextProvider>
  </StrictMode>,
);
