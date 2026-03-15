import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { filterTasks } from "./taskUtils";
import { tasksAdapter } from "./tasksAdapter";
import type { TaskFilter } from "./types";

const selectTasksState = (state: RootState) => state.tasks;

const adapterSelectors = tasksAdapter.getSelectors<RootState>(selectTasksState);

export const {
  selectAll: selectTasks,
  selectById: selectTaskById,
  selectEntities: selectTaskEntities,
  selectIds: selectTaskIds,
  selectTotal: selectTaskTotal,
} = adapterSelectors;

export const selectTaskFilter = (state: RootState): TaskFilter =>
  selectTasksState(state).filter;

export const selectTaskRequests = (state: RootState) =>
  selectTasksState(state).requests;

export const selectTaskErrors = (state: RootState) => selectTasksState(state).errors;

export const selectTaskMutationStatus = (state: RootState) =>
  selectTasksState(state).requests.mutate;

export const selectTaskError = createSelector([selectTaskErrors], (errors) => {
  return errors.mutate;
});

export const selectHasLoadedTasks = (state: RootState): boolean =>
  selectTasksState(state).hasLoaded;

export const selectLastSyncedAt = (state: RootState): number | null =>
  selectTasksState(state).lastSyncedAt;

export const selectLastMutation = (state: RootState) =>
  selectTasksState(state).lastMutation;

export const selectIsTasksMutating = createSelector(
  [selectTaskMutationStatus],
  (status) => status === "loading",
);

export const selectIsTasksBusy = createSelector(
  [selectIsTasksMutating],
  (isMutating) => isMutating,
);

export const selectCompletedTaskIds = createSelector([selectTasks], (tasks) =>
  tasks.filter((task) => task.completed).map((task) => task.id),
);

export const selectCanClearCompleted = createSelector(
  [selectCompletedTaskIds],
  (completedIds) => completedIds.length > 0,
);

export const selectVisibleTasks = createSelector(
  [selectTasks, selectTaskFilter],
  filterTasks,
);

export const selectVisibleTaskIds = createSelector(
  [selectVisibleTasks],
  (tasks) => tasks.map((task) => task.id),
);

export const selectTaskStats = createSelector([selectTasks], (tasks) => {
  let completed = 0;

  for (const task of tasks) {
    if (task.completed) completed++;
  }

  return {
    total: tasks.length,
    completed,
    active: tasks.length - completed,
  };
});
