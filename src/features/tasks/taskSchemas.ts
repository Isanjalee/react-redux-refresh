import { z } from "zod";
import type { Task, TaskCounts, TaskFilter, TaskListQuery, TaskPage } from "./types";

export const TASK_TITLE_MAX_LENGTH = 120;
export const TASK_SEARCH_MAX_LENGTH = 80;
export const DEFAULT_TASK_PAGE_SIZE = 5;
export const MAX_TASK_PAGE_SIZE = 20;

const taskIdSchema = z.string().trim().min(1, "Task id is required");
const taskTitleSchema = z
  .string()
  .transform((value) => value.trim())
  .pipe(
    z
      .string()
      .min(1, "Task title cannot be empty")
      .max(
        TASK_TITLE_MAX_LENGTH,
        `Task title must be ${TASK_TITLE_MAX_LENGTH} characters or fewer`,
      ),
  );
const taskSearchSchema = z
  .string()
  .catch("")
  .transform((value) => value.trim())
  .pipe(
    z
      .string()
      .max(
        TASK_SEARCH_MAX_LENGTH,
        `Search must be ${TASK_SEARCH_MAX_LENGTH} characters or fewer`,
      ),
  );
const taskCreatedAtSchema = z
  .number()
  .int("Task timestamp must be an integer")
  .nonnegative("Task timestamp cannot be negative");
const taskCreatedAtIsoSchema = z
  .string()
  .min(1, "Task timestamp is required")
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Task timestamp is invalid",
  );
const positivePageNumberSchema = z.coerce.number().int().min(1).catch(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(MAX_TASK_PAGE_SIZE).catch(DEFAULT_TASK_PAGE_SIZE);

export const taskFilterSchema = z.enum(["all", "active", "completed"]);

export const taskSchema = z.object({
  id: taskIdSchema,
  title: taskTitleSchema,
  completed: z.boolean(),
  createdAt: taskCreatedAtSchema,
});

export const storedTasksSchema = z.array(taskSchema);

export const taskCountsSchema = z.object({
  total: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  completed: z.number().int().nonnegative(),
});

export const taskListQuerySchema = z.object({
  page: positivePageNumberSchema,
  pageSize: pageSizeSchema,
  search: taskSearchSchema,
  filter: taskFilterSchema.catch("all"),
});

export const taskPageSchema = z.object({
  items: z.array(taskSchema),
  page: positivePageNumberSchema,
  pageSize: pageSizeSchema,
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().min(1),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  filter: taskFilterSchema,
  search: taskSearchSchema,
  counts: taskCountsSchema,
});

export const taskDtoSchema = z.object({
  id: taskIdSchema,
  title: taskTitleSchema,
  isCompleted: z.boolean(),
  createdAtIso: taskCreatedAtIsoSchema,
});

export const taskCountsDtoSchema = taskCountsSchema;

export const taskPageRequestDtoSchema = taskListQuerySchema;

export const taskPageDtoSchema = z.object({
  items: z.array(taskDtoSchema),
  page: positivePageNumberSchema,
  pageSize: pageSizeSchema,
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().min(1),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  filter: taskFilterSchema,
  search: taskSearchSchema,
  counts: taskCountsDtoSchema,
});

export const createTaskRequestSchema = z.object({
  title: taskTitleSchema,
});

export const deleteTaskResponseSchema = z.object({
  id: taskIdSchema,
});

export const clearCompletedResponseSchema = z.object({
  taskIds: z.array(taskIdSchema),
});

export function parseTaskTitle(input: unknown) {
  return taskTitleSchema.parse(input);
}

export function safeParseTaskTitle(input: unknown) {
  return taskTitleSchema.safeParse(input);
}

export function parseTaskListQuery(input: unknown): TaskListQuery {
  return taskListQuerySchema.parse(input) as TaskListQuery;
}

export function parseTask(input: unknown): Task {
  return taskSchema.parse(input) as Task;
}

export function parseStoredTasks(input: unknown): Task[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.flatMap((value) => {
    const parsed = taskSchema.safeParse(value);
    return parsed.success ? [parsed.data as Task] : [];
  });
}

export function parseTaskCounts(input: unknown): TaskCounts {
  return taskCountsSchema.parse(input) as TaskCounts;
}

export function parseTaskPage(input: unknown): TaskPage {
  return taskPageSchema.parse(input) as TaskPage;
}

export function parseTaskFilter(input: unknown): TaskFilter {
  return taskFilterSchema.catch("all").parse(input) as TaskFilter;
}
