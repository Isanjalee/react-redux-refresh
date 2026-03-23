import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { resolveApiBaseUrl, tasksApiConfig } from "../../shared/api/apiConfig";
import { toApiErrorPayloadFromUnknown } from "../../shared/api/apiErrors";
import { makeId, matchesTaskQuery, normalizeTaskListQuery } from "./taskUtils";
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
} from "./taskDtos";
import { taskApiFetch } from "./tasksHttp";
import { parseTaskListQuery, safeParseTaskTitle } from "./taskSchemas";
import type { Task, TaskListQuery, TaskPage } from "./types";

function createOptimisticTask(title: string): Task {
  const parsedTitle = safeParseTaskTitle(title);

  return {
    id: `optimistic-${makeId()}`,
    title: parsedTitle.success ? parsedTitle.data : title.trim(),
    completed: false,
    createdAt: Date.now(),
  };
}

type TaskMutationViewArg = {
  view: TaskListQuery;
};

type AddTaskArg = TaskMutationViewArg & {
  title: string;
};

type ToggleTaskArg = TaskMutationViewArg & {
  id: string;
};

type DeleteTaskArg = TaskMutationViewArg & {
  id: string;
};

function recalculatePagination(page: TaskPage) {
  page.totalPages = Math.max(1, Math.ceil(page.totalItems / page.pageSize));
  if (page.page > page.totalPages) {
    page.page = page.totalPages;
  }
  page.hasNextPage = page.page < page.totalPages;
  page.hasPreviousPage = page.page > 1;
}

function patchPageForAdd(page: TaskPage, task: Task, query: TaskListQuery) {
  page.counts.total += 1;
  page.counts.active += 1;

  if (!matchesTaskQuery(task, query)) {
    return;
  }

  page.totalItems += 1;
  recalculatePagination(page);

  if (query.page === 1) {
    page.items.unshift(task);
    if (page.items.length > page.pageSize) {
      page.items.pop();
    }
  }
}

function patchPageForToggle(page: TaskPage, taskId: string, query: TaskListQuery) {
  const taskIndex = page.items.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return null;
  }

  const currentTask = page.items[taskIndex];
  const nextTask = {
    ...currentTask,
    completed: !currentTask.completed,
  };

  if (currentTask.completed) {
    page.counts.completed -= 1;
    page.counts.active += 1;
  } else {
    page.counts.completed += 1;
    page.counts.active -= 1;
  }

  if (matchesTaskQuery(nextTask, query)) {
    page.items[taskIndex] = nextTask;
  } else {
    page.items.splice(taskIndex, 1);
    page.totalItems = Math.max(0, page.totalItems - 1);
    recalculatePagination(page);
  }

  return nextTask;
}

function patchPageForDelete(page: TaskPage, taskId: string) {
  const taskIndex = page.items.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return null;
  }

  const [removedTask] = page.items.splice(taskIndex, 1);
  page.counts.total -= 1;
  if (removedTask.completed) {
    page.counts.completed -= 1;
  } else {
    page.counts.active -= 1;
  }
  page.totalItems = Math.max(0, page.totalItems - 1);
  recalculatePagination(page);
  return removedTask;
}

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: resolveApiBaseUrl(),
    fetchFn: taskApiFetch,
  }),
  tagTypes: [tasksApiConfig.tagType],
  endpoints: (builder) => ({
    getTasks: builder.query<TaskPage, TaskListQuery>({
      query: (query) => {
        const safeQuery = parseTaskListQuery(normalizeTaskListQuery(query));

        return {
          url: tasksApiConfig.resourcePath,
          params: toTaskPageRequestDto(safeQuery),
        };
      },
      transformResponse: (response: TaskPageDto) => toTaskPage(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((task) => ({
                type: tasksApiConfig.tagType,
                id: task.id,
              })),
              { type: tasksApiConfig.tagType, id: "LIST" },
            ]
          : [{ type: tasksApiConfig.tagType, id: "LIST" }],
    }),
    addTask: builder.mutation<Task, AddTaskArg>({
      async queryFn({ title }, _api, _extraOptions, fetchWithBQ) {
        try {
          const response = await fetchWithBQ({
            url: tasksApiConfig.resourcePath,
            method: "POST",
            body: toCreateTaskRequestDto(title),
          });

          if (response.error) {
            return { error: response.error };
          }

          return { data: toTask(response.data as TaskDto) };
        } catch (error) {
          return {
            error: {
              status: 400,
              data: toApiErrorPayloadFromUnknown(error, "Task request failed"),
            },
          };
        }
      },
      async onQueryStarted({ title, view }, { dispatch, queryFulfilled }) {
        const safeView = parseTaskListQuery(view);
        const optimisticTask = createOptimisticTask(title);
        if (!optimisticTask.title) {
          return;
        }

        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", safeView, (draft) => {
            patchPageForAdd(draft, optimisticTask, safeView);
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData("getTasks", safeView, (draft) => {
              const optimisticIndex = draft.items.findIndex(
                (task) => task.id === optimisticTask.id,
              );

              if (optimisticIndex >= 0) {
                draft.items[optimisticIndex] = data;
                return;
              }

              if (safeView.page === 1 && matchesTaskQuery(data, safeView)) {
                draft.items.unshift(data);
                if (draft.items.length > draft.pageSize) {
                  draft.items.pop();
                }
              }
            }),
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: tasksApiConfig.tagType, id: "LIST" }],
    }),
    toggleTask: builder.mutation<Task, ToggleTaskArg>({
      query: ({ id }) => ({
        url: `${tasksApiConfig.resourcePath}/${id}/toggle`,
        method: "PATCH",
      }),
      transformResponse: (response: TaskDto) => toTask(response),
      async onQueryStarted({ id, view }, { dispatch, queryFulfilled }) {
        const safeView = parseTaskListQuery(view);
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", safeView, (draft) => {
            patchPageForToggle(draft, id, safeView);
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData("getTasks", safeView, (draft) => {
              const index = draft.items.findIndex((task) => task.id === id);
              if (index >= 0) {
                draft.items[index] = data;
              }
            }),
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: tasksApiConfig.tagType, id: arg.id },
        { type: tasksApiConfig.tagType, id: "LIST" },
      ],
    }),
    deleteTask: builder.mutation<string, DeleteTaskArg>({
      query: ({ id }) => ({
        url: `${tasksApiConfig.resourcePath}/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: DeleteTaskResponseDto) =>
        fromDeleteTaskResponseDto(response),
      async onQueryStarted({ id, view }, { dispatch, queryFulfilled }) {
        const safeView = parseTaskListQuery(view);
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", safeView, (draft) => {
            patchPageForDelete(draft, id);
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: tasksApiConfig.tagType, id: arg.id },
        { type: tasksApiConfig.tagType, id: "LIST" },
      ],
    }),
    clearCompleted: builder.mutation<string[], void>({
      query: () => ({
        url: `${tasksApiConfig.resourcePath}/clear-completed`,
        method: "POST",
      }),
      transformResponse: (response: ClearCompletedResponseDto) =>
        fromClearCompletedResponseDto(response),
      invalidatesTags: [{ type: tasksApiConfig.tagType, id: "LIST" }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useToggleTaskMutation,
  useDeleteTaskMutation,
  useClearCompletedMutation,
} = tasksApi;
