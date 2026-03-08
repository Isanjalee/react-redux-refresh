import { makeId } from "./taskUtils";
import type { Task } from "./types";

const STORAGE_KEY = "rr_refresh_tasks_v4";
const STORAGE_DELAY_MS = 250;

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function isTask(value: unknown): value is Task {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as Task).id === "string" &&
    typeof (value as Task).title === "string" &&
    typeof (value as Task).completed === "boolean" &&
    typeof (value as Task).createdAt === "number"
  );
}

function readTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isTask);
  } catch {
    return [];
  }
}

function writeTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export async function fetchStoredTasks(): Promise<Task[]> {
  await delay(STORAGE_DELAY_MS);
  return readTasks();
}

export async function createStoredTask(title: string): Promise<Task> {
  await delay(STORAGE_DELAY_MS);

  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("Task title cannot be empty");
  }

  const nextTask = {
    id: makeId(),
    title: trimmed,
    completed: false,
    createdAt: Date.now(),
  };

  const nextTasks = [nextTask, ...readTasks()];

  writeTasks(nextTasks);
  return nextTask;
}

export async function toggleStoredTask(id: string): Promise<Task> {
  await delay(STORAGE_DELAY_MS);

  let updatedTask: Task | null = null;
  const nextTasks = readTasks().map((task) => {
    if (task.id !== id) return task;

    updatedTask = { ...task, completed: !task.completed };
    return updatedTask;
  });

  if (!updatedTask) {
    throw new Error("Task not found");
  }

  writeTasks(nextTasks);
  return updatedTask;
}

export async function deleteStoredTask(id: string): Promise<string> {
  await delay(STORAGE_DELAY_MS);

  const currentTasks = readTasks();
  const taskExists = currentTasks.some((task) => task.id === id);

  if (!taskExists) {
    throw new Error("Task not found");
  }

  const nextTasks = currentTasks.filter((task) => task.id !== id);
  writeTasks(nextTasks);
  return id;
}

export async function clearStoredCompletedTasks(): Promise<string[]> {
  await delay(STORAGE_DELAY_MS);

  const tasks = readTasks();
  const removedIds = tasks
    .filter((task) => task.completed)
    .map((task) => task.id);
  const nextTasks = tasks.filter((task) => !task.completed);

  writeTasks(nextTasks);
  return removedIds;
}
