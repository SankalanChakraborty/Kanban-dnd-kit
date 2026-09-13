import {
  mockTask,
  mockTaskWithoutDescription,
  mockTaskDone,
} from "../test/mocks/mockTask";
import { render, screen } from "../test/test-utils";
import { describe, it, expect, vi } from "vitest";
import Card from "../Components/Card";
import { useDraggable } from "@dnd-kit/react";

//Mock @dnd-kit
vi.mock("@dnd-kit/react", () => ({
  useDraggable: () => ({
    ref: vi.fn(),
  }),
}));

describe("Card Component", () => {
  it("renders card title", () => {
    render(<Card task={mockTask} />);
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
  });

  it("renders card description when provided", () => {
    render(<Card task={mockTask} />);
    expect(screen.getByText(mockTask.description!)).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<Card task={mockTaskWithoutDescription} />);
    expect(
      screen.getByText(mockTaskWithoutDescription.description || ""),
    ).not.toBeInTheDocument();
  });

  it("renders task creation date", () => {
    render(<Card task={mockTask} />);
    expect(screen.getByText(mockTask.createdAt)).toBeInTheDocument();
  });

  it("renders priority badge on the card", () => {
    render(<Card task={mockTask} />);
    expect(screen.getByText(mockTask.priority)).toBeInTheDocument();
  });

  it("renders priority badge as uppercase", () => {
    render(<Card task={mockTask} />);
    const badge = screen.getByText(mockTask.priority);
    expect(badge.classList.contains("uppercase")).toBe(true);
  });

  it("applies line-through style when status is done", () => {
    render(<Card task={mockTaskDone} />);
    const title = screen.getByText(mockTaskDone.title);
    expect(title.classList.contains("line-through")).toBe(true);
  });

  it("does not apply line-through styles when status is not 'done' ", () => {
    render(<Card task={mockTask} />);
    const title = screen.getByText(mockTask.title);
    expect(title.classList.contains("line-through")).toBe(false);
  });

  // ✅ Draggable test
  it("is draggable", () => {
    render(<Card task={mockTask} />);
    expect(useDraggable).toHaveBeenCalled();
  });
});
