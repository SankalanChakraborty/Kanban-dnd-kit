import { render, screen } from "../test/test-utils";
import { render as renderWithoutProviders } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useTaskContext } from "../Context/TaskContext";

// Test component to access context
const TestComponent = () => {
  const { tasks, setTasks } = useTaskContext();
  const addTaskHandler = () => {
    setTasks((prev) => [
      ...prev,
      {
        id: "1",
        title: "Test",
        status: "to do",
        priority: "medium",
        createdAt: new Date().toLocaleDateString(),
        columnId: "todo",
      },
    ]);
  };
  return (
    <div>
      <div data-testid="task-count">{tasks.length}</div>
      <button onClick={addTaskHandler}>Add task</button>
    </div>
  );
};

describe("TaskContext", () => {
  it("provides tasks and setTasks", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("task-count")).toBeInTheDocument();
  });

  it("initializes with empty tasks array", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("task-count")).toHaveTextContent("0");
  });

  // ✅ Hook Error Test
  it("throws error when used outside provider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderWithoutProviders(<TestComponent />);
    }).toThrow("useTaskContext must be used within TaskContextProvider");

    consoleError.mockRestore();
  });
});