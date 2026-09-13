import { render, screen } from "../test/test-utils";
import Search from "../Components/Search";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";

describe("Search", () => {
  it("renders the all input fields", () => {
    render(<Search />);
    expect(screen.getByTestId("task-name")).toBeInTheDocument();
    expect(screen.getByTestId("task-description")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add item/i }),
    ).toBeInTheDocument();
  });

  it("renders input field with correct placeholders", () => {
    render(<Search />);
    expect(
      screen.getByPlaceholderText("Add a Task item..."),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Task Description..."),
    ).toBeInTheDocument();
  });

  it("renders priority dropdown with default value", () => {
    render(<Search />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("medium");
  });

  // ✅ Input Change Tests
  it("update task name input on change", async () => {
    const user = userEvent.setup();
    render(<Search />);
    const taskInput = screen.getByTestId("task-name") as HTMLInputElement;
    await user.type(taskInput, "New Task");
    expect(taskInput.value).toBe("New Task");
  });

  it("updates task description input on change", async () => {
    const user = userEvent.setup();
    render(<Search />);
    const descInput = screen.getByTestId(
      "task-description",
    ) as HTMLInputElement;
    await user.type(descInput, "Task Description");
    expect(descInput.value).toBe("Task Description");
  });

  it("updates task priority on change", async () => {
    const user = userEvent.setup();
    render(<Search />);
    const taskPriority = screen.getByRole("combobox") as HTMLSelectElement;
    await user.selectOptions(taskPriority, "high");
    expect(taskPriority.value).toBe("high");
  });

  // ✅ Form Submission Tests
  it("clears inputs after successful submission", async () => {
    const user = userEvent.setup();
    render(<Search />);

    const taskInput = screen.getByTestId("task-name") as HTMLInputElement;
    const descInput = screen.getByTestId(
      "task-description",
    ) as HTMLInputElement;

    await user.type(taskInput, "Some Task");
    await user.type(descInput, "Some Description");
    await user.click(screen.getByRole("button", { name: /Add Item/i }));

    expect(taskInput.value).toBe("");
    expect(descInput.value).toBe("");
  });

  it("resets priority dropdown to low after submission", async () => {
    const user = userEvent.setup();
    render(<Search />);

    const taskPriority = screen.getByRole("combobox") as HTMLSelectElement;
    await user.selectOptions(taskPriority, "high");

    const taskInput = screen.getByTestId("task-name") as HTMLInputElement;
    await user.type(taskInput, "Test Task");

    await user.click(screen.getByRole("button", { name: /Add Item/i }));

    expect(taskPriority.value).toBe("low");
  });

  it("does not submit when the task name is empty", async () => {
    const user = userEvent.setup();
    render(<Search />);
    const taskInput = screen.getByTestId("task-name");

    await user.click(screen.getByRole("button", { name: /Add Item/i }));
    // Form should remain with empty input
    expect(taskInput).toHaveValue("");
  });

  it("renders all task priority options", () => {
    render(<Search />);
    expect(
      screen.getByRole("option", { name: /low priority/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /medium priority/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /high priority/i }),
    ).toBeInTheDocument();
  });
});
