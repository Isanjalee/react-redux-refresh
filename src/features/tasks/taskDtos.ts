import type { Task, TaskCounts, TaskFilter, TaskListQuery, TaskPage } from "./types";

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
  return {
    id: task.id,
    title: task.title,
    isCompleted: task.completed,
    createdAtIso: new Date(task.createdAt).toISOString(),
  };
}

export function toTask(taskDto: TaskDto): Task {
  return {
    id: taskDto.id,
    title: taskDto.title,
    completed: taskDto.isCompleted,
    createdAt: Date.parse(taskDto.createdAtIso),
  };
}

export function toTaskList(taskDtos: TaskDto[]) {
  return taskDtos.map(toTask);
}

export function toTaskPageDto(taskPage: TaskPage): TaskPageDto {
  return {
    ...taskPage,
    items: taskPage.items.map(toTaskDto),
  };
}

export function toTaskPage(taskPageDto: TaskPageDto): TaskPage {
  return {
    ...taskPageDto,
    items: toTaskList(taskPageDto.items),
  };
}

export function toTaskPageRequestDto(query: TaskListQuery): TaskPageRequestDto {
  return query;
}

export function toCreateTaskRequestDto(title: string): CreateTaskRequestDto {
  return { title };
}

export function toDeleteTaskResponseDto(id: string): DeleteTaskResponseDto {
  return { id };
}

export function fromDeleteTaskResponseDto(dto: DeleteTaskResponseDto) {
  return dto.id;
}

export function toClearCompletedResponseDto(
  taskIds: string[],
): ClearCompletedResponseDto {
  return { taskIds };
}

export function fromClearCompletedResponseDto(dto: ClearCompletedResponseDto) {
  return dto.taskIds;
}
