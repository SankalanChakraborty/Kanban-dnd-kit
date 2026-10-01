import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import TaskContextProvider from "../Context/TaskContextProvider";
import ModalContextProvider from "../Context/ModalContextProvider";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
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
