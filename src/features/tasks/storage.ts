import {
  filterTasks,
  getTaskCounts,
  makeId,
  normalizeTaskListQuery,
  searchTasks,
} from "./taskUtils";
import {
  parseStoredTasks,
  parseTask,
  parseTaskListQuery,
  parseTaskPage,
  parseTaskTitle,
} from "./taskSchemas";
import type { Task, TaskListQuery, TaskPage } from "./types";

const STORAGE_KEY = "rr_refresh_tasks_v4";
const STORAGE_DELAY_MS = 250;

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function readTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    return parseStoredTasks(parsed);
  } catch {
    return [];
  }
}

function writeTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.map(parseTask)));
}

function paginateTasks(tasks: Task[], query: TaskListQuery): TaskPage {
  const normalizedQuery = normalizeTaskListQuery(parseTaskListQuery(query));
  const filteredTasks = searchTasks(
    filterTasks(tasks, normalizedQuery.filter),
    normalizedQuery.search,
  );
  const totalItems = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / normalizedQuery.pageSize));
  const page = Math.min(normalizedQuery.page, totalPages);
  const start = (page - 1) * normalizedQuery.pageSize;
  const items = filteredTasks.slice(start, start + normalizedQuery.pageSize);

  return parseTaskPage({
    items,
    page,
    pageSize: normalizedQuery.pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    filter: normalizedQuery.filter,
    search: normalizedQuery.search,
    counts: getTaskCounts(tasks),
  });
}

export async function fetchStoredTasksPage(
  query: Partial<TaskListQuery> = {},
): Promise<TaskPage> {
  await delay(STORAGE_DELAY_MS);
  return paginateTasks(readTasks(), parseTaskListQuery(normalizeTaskListQuery(query)));
}

export async function createStoredTask(title: string): Promise<Task> {
  await delay(STORAGE_DELAY_MS);

  const nextTask = parseTask({
    id: makeId(),
    title: parseTaskTitle(title),
    completed: false,
    createdAt: Date.now(),
  });

  const nextTasks = [nextTask, ...readTasks()];

  writeTasks(nextTasks);
  return nextTask;
}

export async function toggleStoredTask(id: string): Promise<Task> {
  await delay(STORAGE_DELAY_MS);

  let updatedTask: Task | null = null;
  const nextTasks = readTasks().map((task) => {
    if (task.id !== id) return task;

    updatedTask = parseTask({ ...task, completed: !task.completed });
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
