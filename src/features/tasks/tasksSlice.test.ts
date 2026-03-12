import { describe, expect, it, vi } from "vitest";
import tasksReducer, { setFilter } from "./tasksSlice";
import { addTask, fetchTasks } from "./tasksThunks";

const sampleTasks = [
  {
    id: "t1",
    title: "Write tests",
    completed: false,
    createdAt: 200,
  },
  {
    id: "t2",
    title: "Review async flow",
    completed: true,
    createdAt: 100,
  },
];

describe("tasksSlice", () => {
  it("updates the active filter", () => {
    const state = tasksReducer(undefined, setFilter({ filter: "completed" }));

    expect(state.filter).toBe("completed");
  });

  it("stores fetched tasks and marks the collection as loaded", () => {
    vi.spyOn(Date, "now").mockReturnValue(1234);

    const state = tasksReducer(
      undefined,
      fetchTasks.fulfilled(sampleTasks, "request-id"),
    );

    expect(state.ids).toEqual(["t1", "t2"]);
    expect(state.entities.t1?.title).toBe("Write tests");
    expect(state.requests.fetch).toBe("succeeded");
    expect(state.errors.fetch).toBeNull();
    expect(state.hasLoaded).toBe(true);
    expect(state.lastSyncedAt).toBe(1234);
  });

  it("captures failed mutations with a user-facing error", () => {
    const pendingState = tasksReducer(
      undefined,
      addTask.pending("request-id", { title: "Broken task" }),
    );

    const state = tasksReducer(
      pendingState,
      addTask.rejected(
        new Error("Task title cannot be empty"),
        "request-id",
        { title: "Broken task" },
        "Task title cannot be empty",
      ),
    );

    expect(state.requests.mutate).toBe("failed");
    expect(state.errors.mutate).toBe("Task title cannot be empty");
  });
});
