import { render, screen } from "../test/test-utils";
import Button from "../Components/Button";
import { describe, it, expect } from "vitest";

describe("Button Component", () => {
  // ✅ Rendering Tests
  it("renders button with children text", () => {
    render(<Button buttonType="submit">Click me</Button>);
    expect(
      screen.getByRole("button", { name: /Click me/i }),
    ).toBeInTheDocument();
  });

  it("renders with correct data-testid", () => {
    render(<Button buttonType="submit">Submit</Button>);
    expect(screen.getByTestId("add-task")).toBeInTheDocument();
  });

  it("renders with submit type", () => {
    render(<Button buttonType="submit">Submit</Button>);
    expect(screen.getByTestId("add-task")).toHaveAttribute("type", "submit");
  });

  //✅ Click handler test
  it("can be clicked", () => {
    render(<Button buttonType="submit">Click</Button>);
    const button = screen.getByTestId("add-task");
    expect(button).not.toBeDisabled();
  });

  // ✅ Content rendering
  it("renders different children component", () => {
    const { rerender } = render(<Button buttonType="submit">First</Button>);
    expect(screen.getByText("First")).toBeInTheDocument();

    rerender(<Button buttonType="submit">Second</Button>);
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
