import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import TasksPage from "./TasksPage";
import {
  createStoredTask,
  fetchStoredTasks,
  toggleStoredTask,
} from "./storage";

vi.mock("./storage", () => ({
  fetchStoredTasks: vi.fn(),
  createStoredTask: vi.fn(),
  toggleStoredTask: vi.fn(),
  deleteStoredTask: vi.fn(),
  clearStoredCompletedTasks: vi.fn(),
}));

const mockedFetchStoredTasks = vi.mocked(fetchStoredTasks);
const mockedCreateStoredTask = vi.mocked(createStoredTask);
const mockedToggleStoredTask = vi.mocked(toggleStoredTask);

describe("TasksPage integration", () => {
  it("loads tasks and lets the user add and toggle them", async () => {
    mockedFetchStoredTasks.mockResolvedValue([
      {
        id: "t1",
        title: "Write reducer tests",
        completed: false,
        createdAt: 200,
      },
      {
        id: "t2",
        title: "Mock the API layer",
        completed: true,
        createdAt: 100,
      },
    ]);

    mockedCreateStoredTask.mockResolvedValue({
      id: "t3",
      title: "Ship Day 6",
      completed: false,
      createdAt: 300,
    });

    mockedToggleStoredTask.mockResolvedValue({
      id: "t1",
      title: "Write reducer tests",
      completed: true,
      createdAt: 200,
    });

    const user = userEvent.setup();

    renderWithProviders(<TasksPage />);

    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
    expect(await screen.findByText("Write reducer tests")).toBeInTheDocument();
    expect(screen.getByText("Mock the API layer")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Add a task..."), "Ship Day 6");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(mockedCreateStoredTask).toHaveBeenCalledWith("Ship Day 6");
    expect(await screen.findByText("Ship Day 6")).toBeInTheDocument();

    await user.click(
      screen.getByRole("checkbox", { name: "Write reducer tests" }),
    );

    expect(mockedToggleStoredTask).toHaveBeenCalledWith("t1");

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: "Write reducer tests" }),
      ).toBeChecked();
    });

    expect(await screen.findByText(/Last mutation:/)).toHaveTextContent(
      "toggleTask",
    );
  });
});
