/* eslint-disable react-refresh/only-export-components */
import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import TaskContextProvider from "../Context/TaskContextProvider";
import ModalContextProvider from "../Context/ModalContextProvider";

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <TaskContextProvider>
      <ModalContextProvider>{children}</ModalContextProvider>
    </TaskContextProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
