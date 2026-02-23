import type { Task, TaskFilter } from "./types";

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === "active") return tasks.filter((t) => !t.completed);
  if (filter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

export function makeId(): string {
  // Simple ID for Day 1. Later you can replace with nanoid/uuid.
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}