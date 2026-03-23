import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TaskForm from "./TaskForm";
import { renderWithProviders } from "../../../test/test-utils";

describe("TaskForm", () => {
  it("shows a validation message for an empty submission", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    renderWithProviders(<TaskForm onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByText("Task title cannot be empty")).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("shows a validation message for an overlong submission", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    renderWithProviders(<TaskForm onAdd={onAdd} />);

    const input = screen.getByPlaceholderText("Add a task...");
    await user.type(input, "x".repeat(121));
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(
      screen.getByText("Task title must be 120 characters or fewer"),
    ).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("submits a trimmed title and resets the field", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    renderWithProviders(<TaskForm onAdd={onAdd} />);

    const input = screen.getByPlaceholderText("Add a task...");

    await user.type(input, "  Ship Day 11 contracts  ");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(onAdd).toHaveBeenCalledWith("Ship Day 11 contracts");
    expect(input).toHaveValue("");
  });
});
