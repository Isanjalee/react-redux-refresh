import { describe, expect, it, vi } from "vitest";
import { createAppStore } from "../../app/store";
import { normalizeTaskListQuery, filterTasks, searchTasks, getTaskCounts } from "./taskUtils";
import { tasksApi } from "./tasksApi";
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

describe("tasksApi", () => {
  it("fetches a paginated task page through the query endpoint", async () => {
    const query = normalizeTaskListQuery({ page: 2, pageSize: 5, search: "", filter: "all" });
    mockedFetchStoredTasksPage.mockResolvedValue(
      createTaskPage(
        [
          { id: "t1", title: "One", completed: false, createdAt: 100 },
          { id: "t2", title: "Two", completed: false, createdAt: 90 },
          { id: "t3", title: "Three", completed: false, createdAt: 80 },
          { id: "t4", title: "Four", completed: false, createdAt: 70 },
          { id: "t5", title: "Five", completed: false, createdAt: 60 },
          { id: "t6", title: "Six", completed: false, createdAt: 50 },
        ],
        query,
      ),
    );

    const store = createAppStore();
    const request = store.dispatch(tasksApi.endpoints.getTasks.initiate(query));
    const result = await request.unwrap();

    expect(mockedFetchStoredTasksPage).toHaveBeenCalledWith(query);
    expect(result.page).toBe(2);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.title).toBe("Six");

    request.unsubscribe();
  });

  it("normalizes api errors for rejected mutations", async () => {
    mockedCreateStoredTask.mockRejectedValue(
      new Error("Task title cannot be empty"),
    );

    const store = createAppStore();
    const result = await store.dispatch(
      tasksApi.endpoints.addTask.initiate({
        title: "",
        view: normalizeTaskListQuery({ page: 1, pageSize: 5, search: "", filter: "all" }),
      }),
    );

    expect("error" in result).toBe(true);
    if (!("error" in result)) {
      throw new Error("Expected a rejected RTK Query action");
    }

    expect(result.error).toEqual({
      status: 400,
      data: {
        message: "Task title cannot be empty",
        code: "TASKS_API_ERROR",
      },
    });
  });

  it("rolls back optimistic create when the mutation fails", async () => {
    const tasks: Task[] = [
      { id: "t1", title: "Existing task", completed: false, createdAt: 100 },
    ];
    const view = normalizeTaskListQuery({ page: 1, pageSize: 5, search: "", filter: "all" });
    const deferredCreate = createDeferredPromise<Task>();

    mockedFetchStoredTasksPage.mockResolvedValue(createTaskPage(tasks, view));
    mockedCreateStoredTask.mockImplementation(() => deferredCreate.promise);

    const store = createAppStore();
    const query = store.dispatch(tasksApi.endpoints.getTasks.initiate(view));
    await query.unwrap();

    const mutation = store.dispatch(
      tasksApi.endpoints.addTask.initiate({ title: "Optimistic task", view }),
    );

    await Promise.resolve();

    expect(
      tasksApi.endpoints.getTasks.select(view)(store.getState()).data?.items[0]?.title,
    ).toBe("Optimistic task");

    deferredCreate.reject(new Error("Create failed"));
    await mutation;
    await waitForTick();

    expect(
      tasksApi.endpoints.getTasks.select(view)(store.getState()).data?.items.map((task) => task.title),
    ).toEqual(["Existing task"]);

    query.unsubscribe();
  });

  it("rolls back optimistic toggle when the mutation fails", async () => {
    const tasks: Task[] = [
      { id: "t1", title: "Existing task", completed: false, createdAt: 100 },
    ];
    const view = normalizeTaskListQuery({ page: 1, pageSize: 5, search: "", filter: "all" });
    const deferredToggle = createDeferredPromise<Task>();

    mockedFetchStoredTasksPage.mockResolvedValue(createTaskPage(tasks, view));
    mockedToggleStoredTask.mockImplementation(() => deferredToggle.promise);

    const store = createAppStore();
    const query = store.dispatch(tasksApi.endpoints.getTasks.initiate(view));
    await query.unwrap();

    const mutation = store.dispatch(
      tasksApi.endpoints.toggleTask.initiate({ id: "t1", view }),
    );

    await Promise.resolve();
    expect(
      tasksApi.endpoints.getTasks.select(view)(store.getState()).data?.items[0]?.completed,
    ).toBe(true);

    deferredToggle.reject(new Error("Toggle failed"));
    await mutation;
    await waitForTick();

    expect(
      tasksApi.endpoints.getTasks.select(view)(store.getState()).data?.items[0]?.completed,
    ).toBe(false);

    query.unsubscribe();
  });

  it("rolls back optimistic delete when the mutation fails", async () => {
    const tasks: Task[] = [
      { id: "t1", title: "Existing task", completed: false, createdAt: 100 },
      { id: "t2", title: "Keep me", completed: false, createdAt: 90 },
    ];
    const view = normalizeTaskListQuery({ page: 1, pageSize: 5, search: "", filter: "all" });
    const deferredDelete = createDeferredPromise<string>();

    mockedFetchStoredTasksPage.mockResolvedValue(createTaskPage(tasks, view));
    mockedDeleteStoredTask.mockImplementation(() => deferredDelete.promise);

    const store = createAppStore();
    const query = store.dispatch(tasksApi.endpoints.getTasks.initiate(view));
    await query.unwrap();

    const mutation = store.dispatch(
      tasksApi.endpoints.deleteTask.initiate({ id: "t1", view }),
    );

    await Promise.resolve();
    expect(
      tasksApi.endpoints.getTasks.select(view)(store.getState()).data?.items.map((task) => task.id),
    ).toEqual(["t2"]);

    deferredDelete.reject(new Error("Delete failed"));
    await mutation;
    await waitForTick();

    expect(
      tasksApi.endpoints.getTasks.select(view)(store.getState()).data?.items.map((task) => task.id),
    ).toEqual(["t1", "t2"]);

    query.unsubscribe();
  });

  it("invalidates and refetches the active page after a mutation", async () => {
    let tasks = [
      { id: "t1", title: "Existing task", completed: false, createdAt: 100 },
    ];
    const view = normalizeTaskListQuery({ page: 1, pageSize: 5, search: "", filter: "all" });

    mockedFetchStoredTasksPage.mockImplementation(async (query) => createTaskPage(tasks, query));
    mockedCreateStoredTask.mockImplementation(async (title: string) => {
      const nextTask = {
        id: "t2",
        title,
        completed: false,
        createdAt: 200,
      };
      tasks = [nextTask, ...tasks];
      return nextTask;
    });
    mockedToggleStoredTask.mockImplementation(async (id: string) => {
      const existing = tasks.find((task) => task.id === id);
      if (!existing) throw new Error("Task not found");
      const updated = { ...existing, completed: !existing.completed };
      tasks = tasks.map((task) => (task.id === id ? updated : task));
      return updated;
    });
    mockedDeleteStoredTask.mockImplementation(async (id: string) => {
      tasks = tasks.filter((task) => task.id !== id);
      return id;
    });
    mockedClearStoredCompletedTasks.mockImplementation(async () => {
      const removedIds = tasks.filter((task) => task.completed).map((task) => task.id);
      tasks = tasks.filter((task) => !task.completed);
      return removedIds;
    });

    const store = createAppStore();
    const query = store.dispatch(tasksApi.endpoints.getTasks.initiate(view));
    await query.unwrap();

    expect(mockedFetchStoredTasksPage).toHaveBeenCalledTimes(1);

    await store.dispatch(
      tasksApi.endpoints.addTask.initiate({ title: "Fresh task", view }),
    ).unwrap();

    await waitForTick();

    expect(mockedFetchStoredTasksPage).toHaveBeenCalledTimes(2);
    expect(
      tasksApi.endpoints.getTasks.select(view)(store.getState()).data?.items[0]?.title,
    ).toBe("Fresh task");

    query.unsubscribe();
  });
});

function waitForTick() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}
