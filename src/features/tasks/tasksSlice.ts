import {
  createAsyncThunk,
  createSelector,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import {
  clearStoredCompletedTasks,
  createStoredTask,
  deleteStoredTask,
  fetchStoredTasks,
  toggleStoredTask,
} from "./storage";
import { filterTasks } from "./taskUtils";
import type { Task, TaskFilter, TaskRequestStatus } from "./types";

type TasksState = {
  items: Task[];
  filter: TaskFilter;
  status: TaskRequestStatus;
  error: string | null;
  hasLoaded: boolean;
};

const initialState: TasksState = {
  items: [],
  filter: "all",
  status: "idle",
  error: null,
  hasLoaded: false,
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Task request failed";
}

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  return fetchStoredTasks();
});

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async ({ title }: { title: string }) => {
    return createStoredTask(title);
  },
);

export const toggleTask = createAsyncThunk(
  "tasks/toggleTask",
  async ({ id }: { id: string }) => {
    return toggleStoredTask(id);
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async ({ id }: { id: string }) => {
    return deleteStoredTask(id);
  },
);

export const clearCompleted = createAsyncThunk(
  "tasks/clearCompleted",
  async () => {
    return clearStoredCompletedTasks();
  },
);

const writeTaskActions = [addTask, toggleTask, deleteTask, clearCompleted];

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<{ filter: TaskFilter }>) {
      state.filter = action.payload.filter;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
        state.error = null;
        state.hasLoaded = true;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error);
        state.hasLoaded = true;
      })
      .addMatcher(isAnyOf(...writeTaskActions.map((action) => action.pending)), (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(
        isAnyOf(...writeTaskActions.map((action) => action.fulfilled)),
        (state, action) => {
          state.items = action.payload;
          state.status = "succeeded";
          state.error = null;
          state.hasLoaded = true;
        },
      )
      .addMatcher(
        isAnyOf(...writeTaskActions.map((action) => action.rejected)),
        (state, action) => {
          state.status = "failed";
          state.error = getErrorMessage(action.error);
        },
      );
  },
});

export const { setFilter } = tasksSlice.actions;

const selectTasksState = (state: RootState): TasksState => state.tasks;

export const selectTasks = (state: RootState): Task[] =>
  selectTasksState(state).items;

export const selectTaskFilter = (state: RootState): TaskFilter =>
  selectTasksState(state).filter;

export const selectTaskStatus = (state: RootState): TaskRequestStatus =>
  selectTasksState(state).status;

export const selectTaskError = (state: RootState): string | null =>
  selectTasksState(state).error;

export const selectHasLoadedTasks = (state: RootState): boolean =>
  selectTasksState(state).hasLoaded;

export const selectIsTasksBusy = createSelector(
  [selectTaskStatus],
  (status) => status === "loading",
);

export const selectVisibleTasks = createSelector(
  [selectTasks, selectTaskFilter],
  filterTasks,
);

export const selectTaskStats = createSelector([selectTasks], (tasks) => {
  let completed = 0;

  for (const task of tasks) {
    if (task.completed) completed++;
  }

  return {
    total: tasks.length,
    completed,
    active: tasks.length - completed,
  };
});

export default tasksSlice.reducer;
