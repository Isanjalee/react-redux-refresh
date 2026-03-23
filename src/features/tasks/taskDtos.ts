import type { Task, TaskCounts, TaskFilter, TaskListQuery, TaskPage } from "./types";
import {
  clearCompletedResponseSchema,
  createTaskRequestSchema,
  deleteTaskResponseSchema,
  parseTask,
  parseTaskCounts,
  parseTaskListQuery,
  parseTaskPage,
  taskCountsDtoSchema,
  taskDtoSchema,
  taskPageDtoSchema,
  taskPageRequestDtoSchema,
  taskSchema,
} from "./taskSchemas";

export type TaskDto = {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAtIso: string;
};

export type TaskCountsDto = TaskCounts;

export type TaskPageRequestDto = TaskListQuery;

export type TaskPageDto = {
  items: TaskDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  filter: TaskFilter;
  search: string;
  counts: TaskCountsDto;
};

export type CreateTaskRequestDto = {
  title: string;
};

export type DeleteTaskResponseDto = {
  id: string;
};

export type ClearCompletedResponseDto = {
  taskIds: string[];
};

export function toTaskDto(task: Task): TaskDto {
  const parsedTask = taskSchema.parse(task);

  return taskDtoSchema.parse({
    id: parsedTask.id,
    title: parsedTask.title,
    isCompleted: parsedTask.completed,
    createdAtIso: new Date(parsedTask.createdAt).toISOString(),
  }) as TaskDto;
}

export function toTask(taskDto: unknown): Task {
  const parsedDto = taskDtoSchema.parse(taskDto);

  return parseTask({
    id: parsedDto.id,
    title: parsedDto.title,
    completed: parsedDto.isCompleted,
    createdAt: Date.parse(parsedDto.createdAtIso),
  });
}

export function toTaskList(taskDtos: unknown[]) {
  return taskDtos.map(toTask);
}

export function toTaskPageDto(taskPage: TaskPage): TaskPageDto {
  const parsedPage = parseTaskPage(taskPage);

  return taskPageDtoSchema.parse({
    ...parsedPage,
    counts: taskCountsDtoSchema.parse(parsedPage.counts),
    items: parsedPage.items.map(toTaskDto),
  }) as TaskPageDto;
}

export function toTaskPage(taskPageDto: unknown): TaskPage {
  const parsedDto = taskPageDtoSchema.parse(taskPageDto);

  return parseTaskPage({
    ...parsedDto,
    counts: parseTaskCounts(parsedDto.counts),
    items: toTaskList(parsedDto.items),
  });
}

export function toTaskPageRequestDto(query: TaskListQuery): TaskPageRequestDto {
  return taskPageRequestDtoSchema.parse(parseTaskListQuery(query)) as TaskPageRequestDto;
}

export function parseCreateTaskRequestDto(input: unknown): CreateTaskRequestDto {
  return createTaskRequestSchema.parse(input) as CreateTaskRequestDto;
}

export function toCreateTaskRequestDto(title: string): CreateTaskRequestDto {
  return parseCreateTaskRequestDto({ title });
}

export function parseDeleteTaskResponseDto(input: unknown): DeleteTaskResponseDto {
  return deleteTaskResponseSchema.parse(input) as DeleteTaskResponseDto;
}

export function toDeleteTaskResponseDto(id: string): DeleteTaskResponseDto {
  return parseDeleteTaskResponseDto({ id });
}

export function fromDeleteTaskResponseDto(dto: unknown) {
  return parseDeleteTaskResponseDto(dto).id;
}

export function parseClearCompletedResponseDto(
  input: unknown,
): ClearCompletedResponseDto {
  return clearCompletedResponseSchema.parse(input) as ClearCompletedResponseDto;
}

export function toClearCompletedResponseDto(
  taskIds: string[],
): ClearCompletedResponseDto {
  return parseClearCompletedResponseDto({ taskIds });
}

export function fromClearCompletedResponseDto(dto: unknown) {
  return parseClearCompletedResponseDto(dto).taskIds;
}
