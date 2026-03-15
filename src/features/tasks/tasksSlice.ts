import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { tasksAdapter } from "./tasksAdapter";
import { tasksApi } from "./tasksApi";
import {
  addTask,
  clearCompleted,
  deleteTask,
  fetchTasks,
  toggleTask,
} from "./tasksThunks";
import type {
  Task,
  TaskFilter,
  TaskMutationType,
  TasksErrorMap,
  TasksRequestMap,
} from "./types";

type TasksState = ReturnType<typeof tasksAdapter.getInitialState> & {
  filter: TaskFilter;
  requests: TasksRequestMap;
  errors: TasksErrorMap;
  hasLoaded: boolean;
  lastSyncedAt: number | null;
  lastMutation: TaskMutationType;
};

const initialState: TasksState = {
  ...tasksAdapter.getInitialState(),
  filter: "all",
  requests: {
    fetch: "idle",
    mutate: "idle",
  },
  errors: {
    fetch: null,
    mutate: null,
  },
  hasLoaded: false,
  lastSyncedAt: null,
  lastMutation: null,
};

function getRejectedMessage(payload: unknown, fallback?: string) {
  if (typeof payload === "string") return payload;

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    typeof payload.data === "string"
  ) {
    return payload.data;
  }

  return fallback ?? "Task request failed";
}

const writeTaskActions = [addTask, toggleTask, deleteTask, clearCompleted];

function markMutationPending(state: TasksState) {
  state.requests.mutate = "loading";
  state.errors.mutate = null;
}

function markMutationSettled(
  state: TasksState,
  mutation: TaskMutationType,
) {
  state.requests.mutate = "succeeded";
  state.lastMutation = mutation;
  state.lastSyncedAt = Date.now();
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<{ filter: TaskFilter }>) {
      state.filter = action.payload.filter;
    },
    hydrateTasksFromQuery(state, action: PayloadAction<{ tasks: Task[] }>) {
      tasksAdapter.setAll(state, action.payload.tasks);
      state.requests.fetch = "succeeded";
      state.errors.fetch = null;
      state.hasLoaded = true;
      state.lastSyncedAt = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.requests.fetch = "loading";
        state.errors.fetch = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        tasksAdapter.setAll(state, action.payload);
        state.requests.fetch = "succeeded";
        state.errors.fetch = null;
        state.hasLoaded = true;
        state.lastSyncedAt = Date.now();
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.requests.fetch = "failed";
        state.errors.fetch = getRejectedMessage(
          action.payload,
          action.error.message,
        );
        state.hasLoaded = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        tasksAdapter.addOne(state, action.payload);
        markMutationSettled(state, "addTask");
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        tasksAdapter.upsertOne(state, action.payload);
        markMutationSettled(state, "toggleTask");
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        tasksAdapter.removeOne(state, action.payload);
        markMutationSettled(state, "deleteTask");
      })
      .addCase(clearCompleted.fulfilled, (state, action) => {
        tasksAdapter.removeMany(state, action.payload);
        markMutationSettled(state, "clearCompleted");
      })
      .addMatcher(
        isAnyOf(...writeTaskActions.map((action) => action.pending)),
        (state) => {
          markMutationPending(state);
        },
      )
      .addMatcher(
        isAnyOf(...writeTaskActions.map((action) => action.rejected)),
        (state, action) => {
          state.requests.mutate = "failed";
          state.errors.mutate = getRejectedMessage(
            action.payload,
            action.error.message,
          );
        },
      )
      .addMatcher(
        isAnyOf(
          tasksApi.endpoints.addTask.matchPending,
          tasksApi.endpoints.toggleTask.matchPending,
          tasksApi.endpoints.deleteTask.matchPending,
          tasksApi.endpoints.clearCompleted.matchPending,
        ),
        (state) => {
          markMutationPending(state);
        },
      )
      .addMatcher(tasksApi.endpoints.addTask.matchFulfilled, (state) => {
        markMutationSettled(state, "addTask");
      })
      .addMatcher(tasksApi.endpoints.toggleTask.matchFulfilled, (state) => {
        markMutationSettled(state, "toggleTask");
      })
      .addMatcher(tasksApi.endpoints.deleteTask.matchFulfilled, (state) => {
        markMutationSettled(state, "deleteTask");
      })
      .addMatcher(tasksApi.endpoints.clearCompleted.matchFulfilled, (state) => {
        markMutationSettled(state, "clearCompleted");
      })
      .addMatcher(
        isAnyOf(
          tasksApi.endpoints.addTask.matchRejected,
          tasksApi.endpoints.toggleTask.matchRejected,
          tasksApi.endpoints.deleteTask.matchRejected,
          tasksApi.endpoints.clearCompleted.matchRejected,
        ),
        (state, action) => {
          state.requests.mutate = "failed";
          state.errors.mutate = getRejectedMessage(
            action.payload,
            action.error.message,
          );
        },
      );
  },
});

export const { hydrateTasksFromQuery, setFilter } = tasksSlice.actions;

export default tasksSlice.reducer;
