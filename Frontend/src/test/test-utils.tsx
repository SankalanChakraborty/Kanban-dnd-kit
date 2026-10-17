/* eslint-disable react-refresh/only-export-components */
import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import TaskContextProvider from "../Context/TaskContextProvider";
import ModalContextProvider from "../Context/ModalContextProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import UserContextProvider from "../Context/UserContextProvide";

const queryClient = new QueryClient();

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <UserContextProvider>
      <TaskContextProvider>
        <ModalContextProvider>
          {children}
          <QueryClientProvider client={queryClient}></QueryClientProvider>
        </ModalContextProvider>
      </TaskContextProvider>
    </UserContextProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
