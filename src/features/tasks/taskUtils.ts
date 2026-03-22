import type { Task, TaskCounts, TaskFilter, TaskListQuery } from "./types";

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === "active") return tasks.filter((task) => !task.completed);
  if (filter === "completed") return tasks.filter((task) => task.completed);
  return tasks;
}

export function searchTasks(tasks: Task[], search: string): Task[] {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) {
    return tasks;
  }

  return tasks.filter((task) =>
    task.title.toLowerCase().includes(normalizedSearch),
  );
}

export function getTaskCounts(tasks: Task[]): TaskCounts {
  let completed = 0;

  for (const task of tasks) {
    if (task.completed) {
      completed += 1;
    }
  }

  return {
    total: tasks.length,
    active: tasks.length - completed,
    completed,
  };
}

export function normalizeTaskListQuery(
  query: Partial<TaskListQuery> = {},
): TaskListQuery {
  return {
    page: Math.max(1, Math.floor(query.page ?? 1)),
    pageSize: Math.max(1, Math.floor(query.pageSize ?? 5)),
    search: (query.search ?? "").trim(),
    filter: query.filter ?? "all",
  };
}

export function matchesTaskQuery(task: Task, query: TaskListQuery) {
  const filteredTask = filterTasks([task], query.filter);
  if (filteredTask.length === 0) {
    return false;
  }

  return searchTasks(filteredTask, query.search).length > 0;
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
