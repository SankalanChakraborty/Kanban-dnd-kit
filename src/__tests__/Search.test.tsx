import { render, screen } from "../test/test-utils";
import Search from "../Components/Search";
import { describe, it, expect } from "vitest";

describe("Search", () => {
  it("renders the search component", () => {
    render(<Search />);
    expect(screen.getByTestId("task-name")).toBeInTheDocument();
    expect(screen.getByTestId("task-description")).toBeInTheDocument();
  });
});
