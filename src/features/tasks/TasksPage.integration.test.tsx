import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import { filterTasks, getTaskCounts, normalizeTaskListQuery, searchTasks } from "./taskUtils";
import TasksPage from "./TasksPage";
import {
  clearStoredCompletedTasks,
  createStoredTask,
  deleteStoredTask,
  fetchStoredTasksPage,
  toggleStoredTask,
} from "./storage";
import type { Task, TaskListQuery, TaskPage } from "./types";

vi.mock("./storage", () => ({
  fetchStoredTasksPage: vi.fn(),
  createStoredTask: vi.fn(),
  toggleStoredTask: vi.fn(),
  deleteStoredTask: vi.fn(),
  clearStoredCompletedTasks: vi.fn(),
}));

const mockedFetchStoredTasksPage = vi.mocked(fetchStoredTasksPage);
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

function createTaskPage(tasks: Task[], query: Partial<TaskListQuery> = {}): TaskPage {
  const normalizedQuery = normalizeTaskListQuery({ pageSize: 5, ...query });
  const filteredTasks = searchTasks(
    filterTasks(tasks, normalizedQuery.filter),
    normalizedQuery.search,
  );
  const totalItems = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / normalizedQuery.pageSize));
  const page = Math.min(normalizedQuery.page, totalPages);
  const start = (page - 1) * normalizedQuery.pageSize;

  return {
    items: filteredTasks.slice(start, start + normalizedQuery.pageSize),
    page,
    pageSize: normalizedQuery.pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    filter: normalizedQuery.filter,
    search: normalizedQuery.search,
    counts: getTaskCounts(tasks),
  };
}

describe("TasksPage integration", () => {
  it("honors url-driven page and search state while keeping paginated mutations working", async () => {
    let tasks: Task[] = [
      { id: "t1", title: "Write reducer tests", completed: false, createdAt: 800 },
      { id: "t2", title: "Mock the API layer", completed: true, createdAt: 700 },
      { id: "t3", title: "Profile route transitions", completed: false, createdAt: 600 },
      { id: "t4", title: "Tune suspense fallback", completed: true, createdAt: 500 },
      { id: "t5", title: "Document RTK Query", completed: false, createdAt: 400 },
      { id: "t6", title: "Review paginated API shape", completed: false, createdAt: 300 },
      { id: "t7", title: "Ship search toolbar", completed: false, createdAt: 200 },
    ];

    const createTaskRequest = createDeferredPromise<Task>();
    const toggleTaskRequest = createDeferredPromise<Task>();
    const deleteTaskRequest = createDeferredPromise<string>();

    mockedFetchStoredTasksPage.mockImplementation(async (query) => createTaskPage(tasks, query));

    mockedCreateStoredTask.mockImplementation(async (title: string) => {
      const nextTask: Task = {
        id: "t8",
        title,
        completed: false,
        createdAt: 900,
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
      const removedIds = tasks.filter((task) => task.completed).map((task) => task.id);
      tasks = tasks.filter((task) => !task.completed);
      return removedIds;
    });

    const user = userEvent.setup();

    renderWithProviders(<TasksPage />, {
      route: "/tasks?search=Mock",
    });

    expect(await screen.findByText("Mock the API layer")).toBeInTheDocument();
    expect(screen.queryByText("Write reducer tests")).not.toBeInTheDocument();
    expect(screen.getByText(/Showing 1-1 of 1 matching tasks/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset query" }));

    expect(await screen.findByText("Write reducer tests")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(await screen.findByText("Review paginated API shape")).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(screen.queryByText("Write reducer tests")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous" }));

    expect(await screen.findByText("Write reducer tests")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Add a task..."), "Ship Day 10");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByText("Ship Day 10")).toBeInTheDocument();
    createTaskRequest.resolve({
      id: "t8",
      title: "Ship Day 10",
      completed: false,
      createdAt: 900,
    });

    const toggleCheckbox = await screen.findByRole("checkbox", {
      name: "Write reducer tests",
    });
    await user.click(toggleCheckbox);
    expect(await screen.findByRole("checkbox", { name: "Write reducer tests" })).toBeChecked();

    toggleTaskRequest.resolve({
      id: "t1",
      title: "Write reducer tests",
      completed: true,
      createdAt: 800,
    });

    const writeReducerLabel = screen.getByText("Write reducer tests").closest("label");
    if (!writeReducerLabel) {
      throw new Error("Expected task row to exist");
    }

    const writeReducerRow = writeReducerLabel.closest("li");
    if (!writeReducerRow) {
      throw new Error("Expected list row to exist");
    }

    await user.click(within(writeReducerRow).getByRole("button", { name: "Delete" }));

    deleteTaskRequest.resolve("t1");


  });
});





