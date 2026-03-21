const DEFAULT_API_BASE_URL = "/api";
const DEFAULT_TASKS_API_PATH = "/tasks";

function normalizeBaseUrl(value: string) {
  if (!value || value === "/") {
    return DEFAULT_API_BASE_URL;
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function normalizeResourcePath(value: string) {
  if (!value) {
    return DEFAULT_TASKS_API_PATH;
  }

  return value.startsWith("/") ? value : "/" + value;
}

function getRuntimeOrigin() {
  if (typeof globalThis.location?.origin === "string") {
    return globalThis.location.origin;
  }

  return "http://localhost";
}

export const apiConfig = {
  baseUrl: normalizeBaseUrl(
    import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  ),
  tasksPath: normalizeResourcePath(
    import.meta.env.VITE_TASKS_API_PATH ?? DEFAULT_TASKS_API_PATH,
  ),
};

export function resolveApiBaseUrl(baseUrl = apiConfig.baseUrl) {
  if (/^https?:\/\//.test(baseUrl)) {
    return baseUrl;
  }

  return new URL(baseUrl, getRuntimeOrigin()).toString().replace(/\/$/, "");
}

export function buildApiUrl(resourcePath: string) {
  return apiConfig.baseUrl + normalizeResourcePath(resourcePath);
}

export const tasksApiConfig = {
  tagType: "Task" as const,
  resourcePath: apiConfig.tasksPath,
  url: buildApiUrl(apiConfig.tasksPath),
};
