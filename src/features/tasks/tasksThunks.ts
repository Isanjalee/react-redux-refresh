import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import {
  clearStoredCompletedTasks,
  createStoredTask,
  deleteStoredTask,
  fetchStoredTasks,
  toggleStoredTask,
} from "./storage";
import type { Task } from "./types";

type ThunkConfig = {
  state: RootState;
  rejectValue: string;
};

const createTasksThunk = createAsyncThunk.withTypes<ThunkConfig>();

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Task request failed";
}

function canStartMutation(state: RootState) {
  return state.tasks.requests.mutate !== "loading";
}

export const fetchTasks = createTasksThunk<Task[], void>(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchStoredTasks();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState();

      return (
        state.tasks.requests.fetch !== "loading" && !state.tasks.hasLoaded
      );
    },
  },
);

export const addTask = createTasksThunk<Task, { title: string }>(
  "tasks/addTask",
  async ({ title }, { rejectWithValue }) => {
    try {
      return await createStoredTask(title);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => canStartMutation(getState()),
  },
);

export const toggleTask = createTasksThunk<Task, { id: string }>(
  "tasks/toggleTask",
  async ({ id }, { rejectWithValue }) => {
    try {
      return await toggleStoredTask(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => canStartMutation(getState()),
  },
);

export const deleteTask = createTasksThunk<string, { id: string }>(
  "tasks/deleteTask",
  async ({ id }, { rejectWithValue }) => {
    try {
      return await deleteStoredTask(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => canStartMutation(getState()),
  },
);

export const clearCompleted = createTasksThunk<string[], void>(
  "tasks/clearCompleted",
  async (_, { rejectWithValue }) => {
    try {
      return await clearStoredCompletedTasks();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => canStartMutation(getState()),
  },
);
