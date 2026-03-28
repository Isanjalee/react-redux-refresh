import { tasksApiConfig } from "../../../shared/api/apiConfig";
import {
  fromClearCompletedResponseDto,
  fromDeleteTaskResponseDto,
  toCreateTaskRequestDto,
  toTask,
  toTaskPage,
  toTaskPageRequestDto,
  type ClearCompletedResponseDto,
  type DeleteTaskResponseDto,
  type TaskDto,
  type TaskPageDto,
} from "../taskDtos";
import { parseTaskListQuery } from "../taskSchemas";
import { normalizeTaskListQuery } from "../taskUtils";
import type { Task, TaskListQuery, TaskPage } from "../types";

export function buildTasksQuery(query: TaskListQuery) {
  const safeQuery = parseTaskListQuery(normalizeTaskListQuery(query));

  return {
    url: tasksApiConfig.resourcePath,
    params: toTaskPageRequestDto(safeQuery),
  };
}

export function buildAddTaskRequest(title: string) {
  return {
    url: tasksApiConfig.resourcePath,
    method: "POST",
    body: toCreateTaskRequestDto(title),
  };
}

export function buildToggleTaskRequest(id: string) {
  return {
    url: `${tasksApiConfig.resourcePath}/${id}/toggle`,
    method: "PATCH",
  };
}

export function buildDeleteTaskRequest(id: string) {
  return {
    url: `${tasksApiConfig.resourcePath}/${id}`,
    method: "DELETE",
  };
}

export function buildClearCompletedRequest() {
  return {
    url: `${tasksApiConfig.resourcePath}/clear-completed`,
    method: "POST",
  };
}

export function mapTaskPageDto(response: TaskPageDto): TaskPage {
  return toTaskPage(response);
}

export function mapTaskDto(response: TaskDto): Task {
  return toTask(response);
}

export function mapDeleteTaskResponse(response: DeleteTaskResponseDto) {
  return fromDeleteTaskResponseDto(response);
}

export function mapClearCompletedResponse(response: ClearCompletedResponseDto) {
  return fromClearCompletedResponseDto(response);
}
