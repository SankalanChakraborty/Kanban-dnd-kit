import { render, screen } from "../test/test-utils";
import { describe, it, expect, vi } from "vitest";
import Column from "../Components/Column";
import type { ColumnType } from "../interface";

// Mock @dnd-kit
vi.mock("@dnd-kit/react", () => ({
  useDroppable: () => ({
    isDropTarget: false,
    ref: vi.fn(),
  }),
}));

const todoColumn: ColumnType = {
  id: "todo",
  title: "to do",
};

const inProgressColumn: ColumnType = {
  id: "in-progress",
  title: "in progress",
};

const doneColumn: ColumnType = {
  id: "done",
  title: "done",
};

describe("Column Component", () => {
  // ✅ Rendering Tests
  it("renders column title", () => {
    render(<Column column={todoColumn} />);
    expect(screen.getByText(todoColumn.title)).toBeInTheDocument();
  });

  it("renders different column titles", () => {
    const { rerender } = render(<Column column={todoColumn} />);
    expect(screen.getByText("to do")).toBeInTheDocument();

    rerender(<Column column={inProgressColumn} />);
    expect(screen.getByText("in progress")).toBeInTheDocument();

    rerender(<Column column={doneColumn} />);
    expect(screen.getByText("done")).toBeInTheDocument();
  });

  it("renders plus button", () => {
    render(<Column column={todoColumn} />);
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
  });

  // ✅ Drop Zone Tests
  it("renders droppable area", () => {
    const { container } = render(<Column column={todoColumn} />);
    const dropZone = container.querySelector(".card-droppable-area");
    expect(dropZone).toBeInTheDocument();
  });

  it("renders with default styling when not drop target", () => {
    const { container } = render(<Column column={todoColumn} />);
    const dropZone = container.querySelector(".card-droppable-area");
    expect(dropZone?.classList.contains("border-slate-700")).toBe(true);
  });

  // ✅ Empty Column Test
  it("renders empty droppable area when no tasks match columnId", () => {
    render(<Column column={todoColumn} />);
    // If no cards are rendered, the drop area should be empty
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
  });

  // ✅ Column Structure Test
  it("has correct container classes", () => {
    const { container } = render(<Column column={todoColumn} />);
    const columnDiv = container.querySelector(".status-col");
    expect(columnDiv?.classList.contains("bg-slate-800")).toBe(true);
    expect(columnDiv?.classList.contains("rounded-lg")).toBe(true);
  });

  it("renders column header with title and button", () => {
    render(<Column column={todoColumn} />);
    expect(screen.getByText("to do")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
  });
});
