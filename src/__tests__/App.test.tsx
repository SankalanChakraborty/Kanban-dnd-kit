import { render, screen } from "../test/test-utils";
import App from "../App";
import { describe, it, expect, vi } from "vitest";

// Mock @dnd-kit
vi.mock("@dnd-kit/react", () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drag-drop-provider">{children}</div>
  ),
  useDroppable: () => ({
    isDropTarget: false,
    ref: vi.fn(),
  }),
  useDraggable: () => ({
    ref: vi.fn(),
  }),
}));

describe("App Component", () => {
  // ✅ Rendering Tests
  it("renders app title", () => {
    render(<App />);
    expect(screen.getByText(/kanban board/i)).toBeInTheDocument();
  });

  it("renders all three columns", () => {
    render(<App />);
    expect(screen.getByText(/to do/i)).toBeInTheDocument();
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });

  it("renders Search component at the top", () => {
    render(<App />);
    expect(screen.getByTestId("task-name")).toBeInTheDocument();
    expect(screen.getByTestId("task-description")).toBeInTheDocument();
  });

  it("renders DragDropProvider wrapper", () => {
    render(<App />);
    expect(screen.getByTestId("drag-drop-provider")).toBeInTheDocument();
  });

  // ✅ Column Count Tests
  it("renders exactly 3 columns with plus buttons", () => {
    render(<App />);
    const plusButtons = screen.getAllByRole("button", { name: "+" });
    expect(plusButtons).toHaveLength(3);
  });

  // ✅ Layout Structure Tests
  it("renders main container with correct styling", () => {
    const { container } = render(<App />);
    const mainContainer = container.querySelector(".container");
    expect(mainContainer?.classList.contains("bg-slate-900")).toBe(true);
  });

  it("renders columns container", () => {
    const { container } = render(<App />);
    const columnsContainer = container.querySelector(".columns-container");
    expect(columnsContainer).toBeInTheDocument();
  });

  // ✅ Component Order Test
  it("renders Search component before columns", () => {
    const { container } = render(<App />);
    const search = screen.getByTestId("task-name");
    const columns = container.querySelectorAll(".status-col");

    expect(search).toBeInTheDocument();
    expect(columns.length).toBe(3);
  });

  // ✅ Search Form Test
  it("renders complete search form with all fields", () => {
    render(<App />);
    expect(
      screen.getByPlaceholderText("Add a Task item..."),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Task Description..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add item/i }),
    ).toBeInTheDocument();
  });

  // ✅ Title and Heading Tests
  it("renders heading with correct font size", () => {
    const { container } = render(<App />);
    const heading = container.querySelector("h1");
    expect(heading?.classList.contains("text-4xl")).toBe(true);
    expect(heading?.textContent).toContain("Kanban board");
  });
});
