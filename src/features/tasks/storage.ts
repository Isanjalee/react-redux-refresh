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

export async function createStoredTask(title: string): Promise<Task[]> {
  await delay(STORAGE_DELAY_MS);

  const trimmed = title.trim();
  if (!trimmed) return readTasks();

  const nextTasks = [
    {
      id: makeId(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    },
    ...readTasks(),
  ];

  writeTasks(nextTasks);
  return nextTasks;
}

export async function toggleStoredTask(id: string): Promise<Task[]> {
  await delay(STORAGE_DELAY_MS);

  const nextTasks = readTasks().map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  );

  writeTasks(nextTasks);
  return nextTasks;
}

export async function deleteStoredTask(id: string): Promise<Task[]> {
  await delay(STORAGE_DELAY_MS);

  const nextTasks = readTasks().filter((task) => task.id !== id);
  writeTasks(nextTasks);
  return nextTasks;
}

export async function clearStoredCompletedTasks(): Promise<Task[]> {
  await delay(STORAGE_DELAY_MS);

  const nextTasks = readTasks().filter((task) => !task.completed);
  writeTasks(nextTasks);
  return nextTasks;
}
