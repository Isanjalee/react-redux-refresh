import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export type ApiErrorPayload = {
  message: string;
  code?: string;
};

export function toApiErrorPayload(
  message: string,
  code = "TASKS_API_ERROR",
): ApiErrorPayload {
  return { message, code };
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return (
    !!value &&
    typeof value === "object" &&
    "message" in value &&
    typeof (value as ApiErrorPayload).message === "string"
  );
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return !!error && typeof error === "object" && "status" in error;
}

function isSerializedError(error: unknown): error is SerializedError {
  return !!error && typeof error === "object" && "message" in error;
}

export function normalizeApiError(
  error: unknown,
  fallback = "Task request failed",
) {
  if (typeof error === "string") {
    return error;
  }

  if (isApiErrorPayload(error)) {
    return error.message;
  }

  if (isFetchBaseQueryError(error)) {
    if (typeof error.data === "string") {
      return error.data;
    }

    if (isApiErrorPayload(error.data)) {
      return error.data.message;
    }

    if (
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data &&
      typeof (error.data as { message: unknown }).message === "string"
    ) {
      return (error.data as { message: string }).message;
    }

    if ("error" in error && typeof error.error === "string") {
      return error.error;
    }
  }

  if (isSerializedError(error) && typeof error.message === "string") {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
