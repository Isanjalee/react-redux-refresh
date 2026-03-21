import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  resolveApiBaseUrl,
  tasksApiConfig,
} from "../../shared/api/apiConfig";
import {
  fromClearCompletedResponseDto,
  fromDeleteTaskResponseDto,
  toCreateTaskRequestDto,
  toTask,
  toTaskList,
  type ClearCompletedResponseDto,
  type DeleteTaskResponseDto,
  type TaskDto,
} from "./taskDtos";
import { taskApiFetch } from "./tasksHttp";
import type { Task } from "./types";

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: resolveApiBaseUrl(),
    fetchFn: taskApiFetch,
  }),
  tagTypes: [tasksApiConfig.tagType],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => tasksApiConfig.resourcePath,
      transformResponse: (response: TaskDto[]) => toTaskList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((task) => ({
                type: tasksApiConfig.tagType,
                id: task.id,
              })),
              { type: tasksApiConfig.tagType, id: "LIST" },
            ]
          : [{ type: tasksApiConfig.tagType, id: "LIST" }],
    }),
    addTask: builder.mutation<Task, { title: string }>({
      query: ({ title }) => ({
        url: tasksApiConfig.resourcePath,
        method: "POST",
        body: toCreateTaskRequestDto(title),
      }),
      transformResponse: (response: TaskDto) => toTask(response),
      invalidatesTags: [{ type: tasksApiConfig.tagType, id: "LIST" }],
    }),
    toggleTask: builder.mutation<Task, { id: string }>({
      query: ({ id }) => ({
        url: `${tasksApiConfig.resourcePath}/${id}/toggle`,
        method: "PATCH",
      }),
      transformResponse: (response: TaskDto) => toTask(response),
      invalidatesTags: (_result, _error, arg) => [
        { type: tasksApiConfig.tagType, id: arg.id },
        { type: tasksApiConfig.tagType, id: "LIST" },
      ],
    }),
    deleteTask: builder.mutation<string, { id: string }>({
      query: ({ id }) => ({
        url: `${tasksApiConfig.resourcePath}/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: DeleteTaskResponseDto) =>
        fromDeleteTaskResponseDto(response),
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
