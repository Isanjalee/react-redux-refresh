import type { Task } from "./types";

const STORAGE_KEY = "rr_refresh_tasks_v1";

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;

    // Basic safety check (avoid crashing on corrupted storage)
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTask);
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function isTask(x: any): x is Task {
  return (
    x &&
    typeof x === "object" &&
    typeof x.id === "string" &&
    typeof x.title === "string" &&
    typeof x.completed === "boolean" &&
    typeof x.createdAt === "number"
  );
}