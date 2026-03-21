import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { tasksApiConfig } from "../../shared/api/apiConfig";
import {
  clearStoredCompletedTasks,
  createStoredTask,
  deleteStoredTask,
  fetchStoredTasks,
  toggleStoredTask,
} from "./storage";
import type { Task } from "./types";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Task request failed";
}

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: [tasksApiConfig.tagType],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      async queryFn() {
        try {
          const data = await fetchStoredTasks();
          return { data };
        } catch (error) {
          return { error: getErrorMessage(error) };
        }
      },
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
      async queryFn({ title }) {
        try {
          const data = await createStoredTask(title);
          return { data };
        } catch (error) {
          return { error: getErrorMessage(error) };
        }
      },
      invalidatesTags: [{ type: tasksApiConfig.tagType, id: "LIST" }],
    }),
    toggleTask: builder.mutation<Task, { id: string }>({
      async queryFn({ id }) {
        try {
          const data = await toggleStoredTask(id);
          return { data };
        } catch (error) {
          return { error: getErrorMessage(error) };
        }
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: tasksApiConfig.tagType, id: arg.id },
        { type: tasksApiConfig.tagType, id: "LIST" },
      ],
    }),
    deleteTask: builder.mutation<string, { id: string }>({
      async queryFn({ id }) {
        try {
          const data = await deleteStoredTask(id);
          return { data };
        } catch (error) {
          return { error: getErrorMessage(error) };
        }
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: tasksApiConfig.tagType, id: arg.id },
        { type: tasksApiConfig.tagType, id: "LIST" },
      ],
    }),
    clearCompleted: builder.mutation<string[], void>({
      async queryFn() {
        try {
          const data = await clearStoredCompletedTasks();
          return { data };
        } catch (error) {
          return { error: getErrorMessage(error) };
        }
      },
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
