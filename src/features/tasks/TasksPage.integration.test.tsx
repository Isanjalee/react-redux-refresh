import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import TasksPage from "./TasksPage";
import {
  clearStoredCompletedTasks,
  createStoredTask,
  deleteStoredTask,
  fetchStoredTasks,
  toggleStoredTask,
} from "./storage";
import type { Task } from "./types";

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
const mockedDeleteStoredTask = vi.mocked(deleteStoredTask);
const mockedClearStoredCompletedTasks = vi.mocked(clearStoredCompletedTasks);

describe("TasksPage integration", () => {
  it("loads tasks and lets the user add and toggle them", async () => {
    let tasks: Task[] = [
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
    ];

    mockedFetchStoredTasks.mockImplementation(async () => tasks);

    mockedCreateStoredTask.mockImplementation(async (title: string) => {
      const nextTask: Task = {
        id: "t3",
        title,
        completed: false,
        createdAt: 300,
      };
      tasks = [nextTask, ...tasks];
      return nextTask;
    });

    mockedToggleStoredTask.mockImplementation(async (id: string) => {
      let updatedTask: Task | undefined;
      tasks = tasks.map((task) => {
        if (task.id !== id) return task;
        updatedTask = { ...task, completed: !task.completed };
        return updatedTask;
      });

      if (!updatedTask) {
        throw new Error("Task not found");
      }

      return updatedTask;
    });

    mockedDeleteStoredTask.mockImplementation(async (id: string) => {
      tasks = tasks.filter((task) => task.id !== id);
      return id;
    });

    mockedClearStoredCompletedTasks.mockImplementation(async () => {
      const removedIds = tasks
        .filter((task) => task.completed)
        .map((task) => task.id);
      tasks = tasks.filter((task) => !task.completed);
      return removedIds;
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
