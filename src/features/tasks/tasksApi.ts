import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  resolveApiBaseUrl,
  tasksApiConfig,
} from "../../shared/api/apiConfig";
import { makeId } from "./taskUtils";
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

function createOptimisticTask(title: string): Task {
  return {
    id: `optimistic-${makeId()}`,
    title: title.trim(),
    completed: false,
    createdAt: Date.now(),
  };
}

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
      async onQueryStarted({ title }, { dispatch, queryFulfilled }) {
        const optimisticTask = createOptimisticTask(title);
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
            draft.unshift(optimisticTask);
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
              const optimisticIndex = draft.findIndex(
                (task) => task.id === optimisticTask.id,
              );

              if (optimisticIndex >= 0) {
                draft[optimisticIndex] = data;
                return;
              }

              const existingIndex = draft.findIndex((task) => task.id === data.id);
              if (existingIndex === -1) {
                draft.unshift(data);
              }
            }),
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: tasksApiConfig.tagType, id: "LIST" }],
    }),
    toggleTask: builder.mutation<Task, { id: string }>({
      query: ({ id }) => ({
        url: `${tasksApiConfig.resourcePath}/${id}/toggle`,
        method: "PATCH",
      }),
      transformResponse: (response: TaskDto) => toTask(response),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
            const task = draft.find((entry) => entry.id === id);
            if (task) {
              task.completed = !task.completed;
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
              const index = draft.findIndex((task) => task.id === id);
              if (index >= 0) {
                draft[index] = data;
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
    deleteTask: builder.mutation<string, { id: string }>({
      query: ({ id }) => ({
        url: `${tasksApiConfig.resourcePath}/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: DeleteTaskResponseDto) =>
        fromDeleteTaskResponseDto(response),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
            const index = draft.findIndex((task) => task.id === id);
            if (index >= 0) {
              draft.splice(index, 1);
            }
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
