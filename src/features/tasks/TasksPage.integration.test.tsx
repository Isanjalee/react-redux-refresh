import { screen, waitFor, within } from "@testing-library/react";
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

function createDeferredPromise<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

describe("TasksPage integration", () => {
  it("loads tasks and applies optimistic create, toggle, and delete before requests resolve", async () => {
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

    const createTaskRequest = createDeferredPromise<Task>();
    const toggleTaskRequest = createDeferredPromise<Task>();
    const deleteTaskRequest = createDeferredPromise<string>();

    mockedFetchStoredTasks.mockImplementation(async () => tasks);

    mockedCreateStoredTask.mockImplementation(async (title: string) => {
      const nextTask: Task = {
        id: "t3",
        title,
        completed: false,
        createdAt: 300,
      };

      createTaskRequest.promise.then(() => {
        tasks = [nextTask, ...tasks];
      });

      return createTaskRequest.promise;
    });

    mockedToggleStoredTask.mockImplementation(async (id: string) => {
      const existing = tasks.find((task) => task.id === id);
      if (!existing) {
        throw new Error("Task not found");
      }

      const updatedTask = { ...existing, completed: !existing.completed };
      toggleTaskRequest.promise.then(() => {
        tasks = tasks.map((task) => (task.id === id ? updatedTask : task));
      });

      return toggleTaskRequest.promise;
    });

    mockedDeleteStoredTask.mockImplementation(async (id: string) => {
      deleteTaskRequest.promise.then(() => {
        tasks = tasks.filter((task) => task.id !== id);
      });

      return deleteTaskRequest.promise;
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

    await user.type(screen.getByPlaceholderText("Add a task..."), "Ship Day 9");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(mockedCreateStoredTask).toHaveBeenCalledWith("Ship Day 9");
    expect(await screen.findByText("Ship Day 9")).toBeInTheDocument();

    createTaskRequest.resolve({
      id: "t3",
      title: "Ship Day 9",
      completed: false,
      createdAt: 300,
    });

    await waitFor(() => {
      expect(screen.getByText("Ship Day 9")).toBeInTheDocument();
    });

    const toggleCheckbox = screen.getByRole("checkbox", {
      name: "Write reducer tests",
    });
    expect(toggleCheckbox).not.toBeChecked();

    await user.click(toggleCheckbox);

    expect(mockedToggleStoredTask).toHaveBeenCalledWith("t1");
    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: "Write reducer tests" }),
      ).toBeChecked();
    });

    toggleTaskRequest.resolve({
      id: "t1",
      title: "Write reducer tests",
      completed: true,
      createdAt: 200,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: "Write reducer tests" }),
      ).toBeChecked();
    });

    const writeReducerLabel = screen.getByText("Write reducer tests").closest("label");
    if (!writeReducerLabel) {
      throw new Error("Expected the task label row to exist");
    }

    const writeReducerRow = writeReducerLabel.closest("li");
    if (!writeReducerRow) {
      throw new Error("Expected the task list item to exist");
    }

    await user.click(within(writeReducerRow).getByRole("button", { name: "Delete" }));

    expect(mockedDeleteStoredTask).toHaveBeenCalledWith("t1");
    await waitFor(() => {
      expect(screen.queryByText("Write reducer tests")).not.toBeInTheDocument();
    });

    deleteTaskRequest.resolve("t1");

    await waitFor(() => {
      expect(screen.queryByText("Write reducer tests")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/Last mutation:/)).toHaveTextContent("deleteTask");
    });
  });
});
