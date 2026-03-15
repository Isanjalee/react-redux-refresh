import { describe, expect, it, vi } from "vitest";
import tasksReducer, {
  hydrateTasksFromQuery,
  setFilter,
} from "./tasksSlice";

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

  it("hydrates query results into the normalized collection", () => {
    vi.spyOn(Date, "now").mockReturnValue(1234);

    const state = tasksReducer(
      undefined,
      hydrateTasksFromQuery({ tasks: sampleTasks }),
    );

    expect(state.ids).toEqual(["t1", "t2"]);
    expect(state.entities.t1?.title).toBe("Write tests");
    expect(state.hasLoaded).toBe(true);
    expect(state.lastSyncedAt).toBe(1234);
  });
});
