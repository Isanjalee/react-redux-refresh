import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskFilter } from "./types";
import { makeId } from "./taskUtils";

/** LocalStorage key for Redux-persisted tasks */
const STORAGE_KEY = "rr_refresh_tasks_v3";

/** Load from localStorage */
function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t: any) =>
        t &&
        typeof t.id === "string" &&
        typeof t.title === "string" &&
        typeof t.completed === "boolean" &&
        typeof t.createdAt === "number",
    );
  } catch {
    return [];
  }
}

/** Save to localStorage */
function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

type TasksState = {
  items: Task[];
  filter: TaskFilter;
};

const initialState: TasksState = {
  items: loadTasks(),
  filter: "all",
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<{ title: string }>) {
      const trimmed = action.payload.title.trim();
      if (!trimmed) return;

      const newTask: Task = {
        id: makeId(),
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      };

      state.items.unshift(newTask);
      saveTasks(state.items);
    },

    toggleTask(state, action: PayloadAction<{ id: string }>) {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (!task) return;

      task.completed = !task.completed;
      saveTasks(state.items);
    },

    deleteTask(state, action: PayloadAction<{ id: string }>) {
      state.items = state.items.filter((t) => t.id !== action.payload.id);
      saveTasks(state.items);
    },

    clearCompleted(state) {
      state.items = state.items.filter((t) => !t.completed);
      saveTasks(state.items);
    },

    setFilter(state, action: PayloadAction<{ filter: TaskFilter }>) {
      state.filter = action.payload.filter;
    },
  },
});

export const { addTask, toggleTask, deleteTask, clearCompleted, setFilter } =
  tasksSlice.actions;

export default tasksSlice.reducer;
