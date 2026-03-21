import { apiConfig, tasksApiConfig } from "../../shared/api/apiConfig";
import {
  clearStoredCompletedTasks,
  createStoredTask,
  deleteStoredTask,
  fetchStoredTasks,
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

const tasksCollectionPath = `${apiConfig.baseUrl}${tasksApiConfig.resourcePath}`;
const clearCompletedPath = `${tasksCollectionPath}/clear-completed`;

export async function taskApiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const requestUrl = new URL(getRequestUrl(input), "http://localhost");
  const method = getRequestMethod(input, init);
  const pathname = requestUrl.pathname;

  try {
    if (pathname === tasksCollectionPath && method === "GET") {
      const tasks = await fetchStoredTasks();
      return jsonResponse(tasks);
    }

    if (pathname === tasksCollectionPath && method === "POST") {
      const rawBody = await getRequestBody(input, init);
      const payload = rawBody ? JSON.parse(rawBody) : {};
      const task = await createStoredTask(String(payload.title ?? ""));
      return jsonResponse(task, 201);
    }

    if (pathname === clearCompletedPath && method === "POST") {
      const removedIds = await clearStoredCompletedTasks();
      return jsonResponse(removedIds);
    }

    if (pathname.endsWith("/toggle") && method === "PATCH") {
      const id = pathname.split("/").slice(-2, -1)[0];
      const task = await toggleStoredTask(id);
      return jsonResponse(task);
    }

    if (pathname.startsWith(`${tasksCollectionPath}/`) && method === "DELETE") {
      const id = getTaskIdFromDeletePath(pathname);
      if (!id) {
        return jsonResponse("Task not found", 404);
      }

      const deletedId = await deleteStoredTask(id);
      return jsonResponse(deletedId);
    }

    return jsonResponse("Route not found", 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Task request failed";
    return jsonResponse(message, 400);
  }
}
