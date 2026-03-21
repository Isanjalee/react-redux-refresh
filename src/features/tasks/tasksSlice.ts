import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { normalizeApiError } from "../../shared/api/apiErrors";
import { tasksApi } from "./tasksApi";
import { tasksAdapter } from "./tasksAdapter";
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
    mutate: "idle",
  },
  errors: {
    mutate: null,
  },
  hasLoaded: false,
  lastSyncedAt: null,
  lastMutation: null,
};

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
      state.hasLoaded = true;
      state.lastSyncedAt = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
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
          state.errors.mutate = normalizeApiError(
            action.payload ?? action.error,
            "Task request failed",
          );
        },
      );
  },
});

export const { hydrateTasksFromQuery, setFilter } = tasksSlice.actions;

export default tasksSlice.reducer;
