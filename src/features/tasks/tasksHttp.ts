import { apiConfig, tasksApiConfig } from "../../shared/api/apiConfig";
import {
  toApiErrorPayload,
  toApiErrorPayloadFromUnknown,
} from "../../shared/api/apiErrors";
import { parseTaskListQuery } from "./taskSchemas";
import {
  parseCreateTaskRequestDto,
  toClearCompletedResponseDto,
  toDeleteTaskResponseDto,
  toTaskDto,
  toTaskPageDto,
} from "./taskDtos";
import {
  clearStoredCompletedTasks,
  createStoredTask,
  deleteStoredTask,
  fetchStoredTasksPage,
  toggleStoredTask,
} from "./storage";

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function getRequestBody(input: RequestInfo | URL, init?: RequestInit) {
  if (typeof init?.body === "string") {
    return init.body;
  }

  if (input instanceof Request) {
    return input.text();
  }

  return undefined;
}

function getRequestUrl(input: RequestInfo | URL) {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

function getRequestMethod(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.method) {
    return init.method.toUpperCase();
  }

  if (input instanceof Request) {
    return input.method.toUpperCase();
  }

  return "GET";
}

function getTaskIdFromDeletePath(pathname: string) {
  const match = pathname.match(/\/tasks\/([^/]+)$/);
  return match?.[1] ?? null;
}

function readJsonBody(rawBody: string | undefined) {
  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw new Error("Request body must be valid JSON");
  }
}

const tasksCollectionPath = `${apiConfig.baseUrl}${tasksApiConfig.resourcePath}`;
const clearCompletedPath = `${tasksCollectionPath}/clear-completed`;

export async function taskApiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const requestUrl = new URL(getRequestUrl(input), "http://localhost");
  const method = getRequestMethod(input, init);
  const pathname = requestUrl.pathname;

  try {
    if (pathname === tasksCollectionPath && method === "GET") {
      const taskPage = await fetchStoredTasksPage(
        parseTaskListQuery({
          page: requestUrl.searchParams.get("page") ?? undefined,
          pageSize: requestUrl.searchParams.get("pageSize") ?? undefined,
          search: requestUrl.searchParams.get("search") ?? undefined,
          filter: requestUrl.searchParams.get("filter") ?? undefined,
        }),
      );
      return jsonResponse(toTaskPageDto(taskPage));
    }

    if (pathname === tasksCollectionPath && method === "POST") {
      const rawBody = await getRequestBody(input, init);
      const payload = parseCreateTaskRequestDto(readJsonBody(rawBody));
      const task = await createStoredTask(payload.title);
      return jsonResponse(toTaskDto(task), 201);
    }

    if (pathname === clearCompletedPath && method === "POST") {
      const removedIds = await clearStoredCompletedTasks();
      return jsonResponse(toClearCompletedResponseDto(removedIds));
    }

    if (pathname.endsWith("/toggle") && method === "PATCH") {
      const id = pathname.split("/").slice(-2, -1)[0];
      const task = await toggleStoredTask(id);
      return jsonResponse(toTaskDto(task));
    }

    if (pathname.startsWith(`${tasksCollectionPath}/`) && method === "DELETE") {
      const id = getTaskIdFromDeletePath(pathname);
      if (!id) {
        return jsonResponse(toApiErrorPayload("Task not found", "TASK_NOT_FOUND"), 404);
      }

      const deletedId = await deleteStoredTask(id);
      return jsonResponse(toDeleteTaskResponseDto(deletedId));
    }

    return jsonResponse(toApiErrorPayload("Route not found", "ROUTE_NOT_FOUND"), 404);
  } catch (error) {
    return jsonResponse(
      toApiErrorPayloadFromUnknown(error, "Task request failed"),
      400,
    );
  }
}
