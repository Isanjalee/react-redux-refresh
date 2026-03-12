import { describe, expect, it, vi } from "vitest";
import { createAppStore } from "../../app/store";
import tasksReducer from "./tasksSlice";
import { selectTaskTotal } from "./tasksSelectors";
import { addTask, fetchTasks } from "./tasksThunks";
import {
  createStoredTask,
  fetchStoredTasks,
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

describe("tasksThunks", () => {
  it("fetches tasks and stores them in Redux state", async () => {
    mockedFetchStoredTasks.mockResolvedValue([
      {
        id: "t1",
        title: "Load tasks",
        completed: false,
        createdAt: 100,
      },
    ]);

    const store = createAppStore();
    const result = await store.dispatch(fetchTasks());

    expect(fetchTasks.fulfilled.match(result)).toBe(true);
    expect(mockedFetchStoredTasks).toHaveBeenCalledTimes(1);
    expect(selectTaskTotal(store.getState())).toBe(1);
    expect(store.getState().tasks.hasLoaded).toBe(true);
  });

  it("does not start addTask while a mutation is already in flight", async () => {
    const store = createAppStore({
      tasks: {
        ...tasksReducer(undefined, { type: "tasks/init" }),
        requests: {
          fetch: "idle",
          mutate: "loading",
        },
      },
    });

    const result = await store.dispatch(addTask({ title: "Blocked" }));

    expect(addTask.rejected.match(result)).toBe(true);
    if (!addTask.rejected.match(result)) {
      throw new Error("Expected addTask to be rejected by condition");
    }

    expect(result.meta.condition).toBe(true);
    expect(mockedCreateStoredTask).not.toHaveBeenCalled();
    expect(store.getState().tasks.requests.mutate).toBe("loading");
  });

  it("returns a reject payload when the API layer throws", async () => {
    mockedCreateStoredTask.mockRejectedValue(
      new Error("Task title cannot be empty"),
    );

    const store = createAppStore();
    const result = await store.dispatch(addTask({ title: "   " }));

    expect(addTask.rejected.match(result)).toBe(true);
    if (!addTask.rejected.match(result)) {
      throw new Error("Expected addTask to reject");
    }

    expect(result.payload).toBe("Task title cannot be empty");
    expect(store.getState().tasks.errors.mutate).toBe(
      "Task title cannot be empty",
    );
  });
});
