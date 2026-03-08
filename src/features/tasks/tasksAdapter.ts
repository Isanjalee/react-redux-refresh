import { createEntityAdapter } from "@reduxjs/toolkit";
import type { Task } from "./types";

export const tasksAdapter = createEntityAdapter<Task>({
  sortComparer: (a, b) => b.createdAt - a.createdAt,
});
