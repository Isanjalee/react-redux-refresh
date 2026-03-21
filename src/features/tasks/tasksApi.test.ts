import { describe, expect, it, vi } from "vitest";
import { createAppStore } from "../../app/store";
import { tasksApi } from "./tasksApi";
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

describe("tasksApi", () => {
  it("fetches tasks through the query endpoint", async () => {
    mockedFetchStoredTasks.mockResolvedValue([
      {
        id: "t1",
        title: "Load tasks",
        completed: false,
        createdAt: 100,
      },
    ]);

    const store = createAppStore();
    const query = store.dispatch(tasksApi.endpoints.getTasks.initiate());
    const result = await query.unwrap();

    expect(result).toHaveLength(1);
    expect(mockedFetchStoredTasks).toHaveBeenCalledTimes(1);
    expect(tasksApi.endpoints.getTasks.select()(store.getState()).data).toEqual(
      result,
    );

    query.unsubscribe();
  });

  it("creates a task through the mutation endpoint", async () => {
    mockedCreateStoredTask.mockResolvedValue({
      id: "t2",
      title: "Ship RTK Query",
      completed: false,
      createdAt: 200,
    });

    const store = createAppStore();
    const result = await store.dispatch(
      tasksApi.endpoints.addTask.initiate({ title: "Ship RTK Query" }),
    ).unwrap();

    expect(mockedCreateStoredTask).toHaveBeenCalledWith("Ship RTK Query");
    expect(result.title).toBe("Ship RTK Query");
  });

  it("normalizes api errors for rejected mutations", async () => {
    mockedCreateStoredTask.mockRejectedValue(
      new Error("Task title cannot be empty"),
    );

    const store = createAppStore();
    const result = await store.dispatch(
      tasksApi.endpoints.addTask.initiate({ title: "" }),
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
      {
        id: "t1",
        title: "Existing task",
        completed: false,
        createdAt: 100,
      },
    ];
    const deferredCreate = createDeferredPromise<Task>();

    mockedFetchStoredTasks.mockResolvedValue(tasks);
    mockedCreateStoredTask.mockImplementation(() => deferredCreate.promise);

    const store = createAppStore();
    const query = store.dispatch(tasksApi.endpoints.getTasks.initiate());
    await query.unwrap();

    const mutation = store.dispatch(
      tasksApi.endpoints.addTask.initiate({ title: "Optimistic task" }),
    );

    await Promise.resolve();

    expect(
      tasksApi.endpoints.getTasks.select()(store.getState()).data?.[0]?.title,
    ).toBe("Optimistic task");

    deferredCreate.reject(new Error("Create failed"));
    await mutation;

    await waitForTick();

    expect(
      tasksApi.endpoints.getTasks.select()(store.getState()).data,
    ).toEqual(tasks);

    query.unsubscribe();
  });

  it("rolls back optimistic toggle when the mutation fails", async () => {
    const tasks: Task[] = [
      {
        id: "t1",
        title: "Existing task",
        completed: false,
        createdAt: 100,
      },
    ];
    const deferredToggle = createDeferredPromise<Task>();

    mockedFetchStoredTasks.mockResolvedValue(tasks);
    mockedToggleStoredTask.mockImplementation(() => deferredToggle.promise);

    const store = createAppStore();
    const query = store.dispatch(tasksApi.endpoints.getTasks.initiate());
    await query.unwrap();

    const mutation = store.dispatch(
      tasksApi.endpoints.toggleTask.initiate({ id: "t1" }),
    );

    await Promise.resolve();

    expect(
      tasksApi.endpoints.getTasks.select()(store.getState()).data?.[0]?.completed,
    ).toBe(true);

    deferredToggle.reject(new Error("Toggle failed"));
    await mutation;

    await waitForTick();

    expect(
      tasksApi.endpoints.getTasks.select()(store.getState()).data?.[0]?.completed,
    ).toBe(false);

    query.unsubscribe();
  });

  it("rolls back optimistic delete when the mutation fails", async () => {
    const tasks: Task[] = [
      {
        id: "t1",
        title: "Existing task",
        completed: false,
        createdAt: 100,
      },
      {
        id: "t2",
        title: "Keep me",
        completed: false,
        createdAt: 90,
      },
    ];
    const deferredDelete = createDeferredPromise<string>();

    mockedFetchStoredTasks.mockResolvedValue(tasks);
    mockedDeleteStoredTask.mockImplementation(() => deferredDelete.promise);

    const store = createAppStore();
    const query = store.dispatch(tasksApi.endpoints.getTasks.initiate());
    await query.unwrap();

    const mutation = store.dispatch(
      tasksApi.endpoints.deleteTask.initiate({ id: "t1" }),
    );

    await Promise.resolve();

    expect(
      tasksApi.endpoints.getTasks.select()(store.getState()).data?.map(
        (task) => task.id,
      ),
    ).toEqual(["t2"]);

    deferredDelete.reject(new Error("Delete failed"));
    await mutation;

    await waitForTick();

    expect(
      tasksApi.endpoints.getTasks.select()(store.getState()).data?.map(
        (task) => task.id,
      ),
    ).toEqual(["t1", "t2"]);

    query.unsubscribe();
  });

  it("invalidates and refetches the task list after a mutation", async () => {
    let tasks = [
      {
        id: "t1",
        title: "Existing task",
        completed: false,
        createdAt: 100,
      },
    ];

    mockedFetchStoredTasks.mockImplementation(async () => tasks);
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
    const query = store.dispatch(tasksApi.endpoints.getTasks.initiate());
    await query.unwrap();

    expect(mockedFetchStoredTasks).toHaveBeenCalledTimes(1);

    await store.dispatch(
      tasksApi.endpoints.addTask.initiate({ title: "Fresh task" }),
    ).unwrap();

    await waitForTick();

    expect(mockedFetchStoredTasks).toHaveBeenCalledTimes(2);
    expect(
      tasksApi.endpoints.getTasks.select()(store.getState()).data?.[0]?.title,
    ).toBe("Fresh task");

    query.unsubscribe();
  });
});

function waitForTick() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}
