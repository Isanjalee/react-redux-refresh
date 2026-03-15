import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
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
  tagTypes: ["Task"],
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
              ...result.map((task) => ({ type: "Task" as const, id: task.id })),
              { type: "Task" as const, id: "LIST" },
            ]
          : [{ type: "Task" as const, id: "LIST" }],
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
      invalidatesTags: [{ type: "Task", id: "LIST" }],
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
        { type: "Task", id: arg.id },
        { type: "Task", id: "LIST" },
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
        { type: "Task", id: arg.id },
        { type: "Task", id: "LIST" },
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
      invalidatesTags: [{ type: "Task", id: "LIST" }],
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
