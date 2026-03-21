import { lazy, Suspense, useCallback, useDeferredValue, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskFilters from "./components/TaskFilters";
import TaskList from "./components/TaskList";
import Button from "../../shared/components/Button";
import LoadingPanel from "../../shared/components/LoadingPanel";
import RenderProfiler from "../../shared/components/RenderProfiler";
import { normalizeApiError } from "../../shared/api/apiErrors";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  useAddTaskMutation,
  useClearCompletedMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useToggleTaskMutation,
} from "./tasksApi";
import { hydrateTasksFromQuery, setFilter } from "./tasksSlice";
import {
  selectCanClearCompleted,
  selectHasLoadedTasks,
  selectIsTasksMutating,
  selectLastMutation,
  selectLastSyncedAt,
  selectTaskErrors,
  selectTaskFilter,
  selectTaskStats,
  selectVisibleTaskIds,
} from "./tasksSelectors";

const TasksInsightsPanel = lazy(() => import("./components/TasksInsightsPanel"));

function getEmptyStateCopy(filter: "all" | "active" | "completed") {
  if (filter === "active") {
    return {
      title: "No active tasks",
      description:
        "Everything is done right now. Add a new task or switch filters to review completed work.",
    };
  }

  if (filter === "completed") {
    return {
      title: "No completed tasks",
      description:
        "Completed work will appear here once tasks are checked off.",
    };
  }

  return {
    title: "No tasks yet",
    description:
      "Add your first task to start building this workspace and tracking progress.",
  };
}

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectTaskFilter);
  const visibleTaskIds = useAppSelector(selectVisibleTaskIds);
  const deferredTaskIds = useDeferredValue(visibleTaskIds);
  const stats = useAppSelector(selectTaskStats);
  const isMutating = useAppSelector(selectIsTasksMutating);
  const canClearCompleted = useAppSelector(selectCanClearCompleted);
  const taskErrors = useAppSelector(selectTaskErrors);
  const hasLoaded = useAppSelector(selectHasLoadedTasks);
  const lastSyncedAt = useAppSelector(selectLastSyncedAt);
  const lastMutation = useAppSelector(selectLastMutation);
  const {
    data: fetchedTasks,
    error: fetchError,
    isError: isFetchError,
    isFetching,
    isLoading,
    refetch,
  } = useGetTasksQuery();
  const [runAddTask] = useAddTaskMutation();
  const [runToggleTask] = useToggleTaskMutation();
  const [runDeleteTask] = useDeleteTaskMutation();
  const [runClearCompleted] = useClearCompletedMutation();

  useEffect(() => {
    if (fetchedTasks) {
      dispatch(hydrateTasksFromQuery({ tasks: fetchedTasks }));
    }
  }, [dispatch, fetchedTasks]);

  const onAdd = useCallback(
    (title: string) => {
      void runAddTask({ title });
    },
    [runAddTask],
  );

  const onToggle = useCallback(
    (id: string) => {
      void runToggleTask({ id });
    },
    [runToggleTask],
  );

  const onDelete = useCallback(
    (id: string) => {
      void runDeleteTask({ id });
    },
    [runDeleteTask],
  );

  const onClearCompleted = useCallback(() => {
    void runClearCompleted();
  }, [runClearCompleted]);

  const onFilterChange = useCallback(
    (nextFilter: typeof filter) => {
      dispatch(setFilter({ filter: nextFilter }));
    },
    [dispatch],
  );

  const showInitialLoading = (isLoading || isFetching) && !hasLoaded;
  const showRefreshingState = isFetching && hasLoaded;
  const isListDeferred = deferredTaskIds !== visibleTaskIds;
  const isInteractionLocked = isMutating || showInitialLoading;
  const mutationError = taskErrors.mutate;
  const queryError = isFetchError
    ? normalizeApiError(fetchError, "Task request failed")
    : null;
  const error = mutationError ?? queryError;
  const showBlockingQueryError = Boolean(queryError && !hasLoaded);
  const emptyState = getEmptyStateCopy(filter);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-slate-200 px-1 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
            Tasks Feature
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            React Refresh Tasks Workspace
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            Total: <b>{stats.total}</b> | Active: <b>{stats.active}</b> |
            Completed: <b>{stats.completed}</b>
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-teal-700">
            Day 9 architecture: RTK Query server-state flows, optimistic cache updates,
            rollback safety, and production-style loading UX
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end sm:pt-4">
          {showRefreshingState && (
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
              Syncing latest changes
            </div>
          )}

          <Button
            variant="secondary"
            onClick={onClearCompleted}
            disabled={!canClearCompleted || isInteractionLocked}
          >
            Clear completed
          </Button>
        </div>
      </header>

      <main className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <TaskForm onAdd={onAdd} disabled={isInteractionLocked} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TaskFilters
            value={filter}
            onChange={onFilterChange}
            disabled={isInteractionLocked}
          />

          {hasLoaded && (
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="text-left text-sm font-medium text-teal-700 transition hover:text-teal-900 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {isFetching ? "Refreshing..." : "Refresh tasks"}
            </button>
          )}
        </div>

        {error && !showBlockingQueryError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-700">
                  Request issue
                </p>
                <p className="mt-2 leading-6">{error}</p>
              </div>
              {queryError && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                >
                  Retry sync
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {isListDeferred && !showInitialLoading && (
            <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
              Updating the filtered task view...
            </div>
          )}

          {showInitialLoading ? (
            <LoadingPanel
              compact
              title="Loading tasks..."
              description="Restoring the task workspace and synchronizing the first view."
            />
          ) : showBlockingQueryError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-700">
                Initial sync failed
              </p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">
                We couldn't load the workspace
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                {queryError}
              </p>
              <div className="mt-6 flex justify-center">
                <Button type="button" onClick={() => void refetch()} disabled={isFetching}>
                  Try again
                </Button>
              </div>
            </div>
          ) : (
            <RenderProfiler id="TasksList">
              <TaskList
                taskIds={deferredTaskIds}
                onToggle={onToggle}
                onDelete={onDelete}
                disabled={isMutating}
                emptyTitle={emptyState.title}
                emptyDescription={emptyState.description}
              />
            </RenderProfiler>
          )}
        </div>
      </main>

      <Suspense
        fallback={
          <div className="mt-6 px-1">
            <LoadingPanel
              compact
              title="Loading workspace insights"
              description="Preparing sync and mutation metadata for this feature."
            />
          </div>
        }
      >
        <RenderProfiler id="TasksInsightsPanel">
          <TasksInsightsPanel
            total={stats.total}
            active={stats.active}
            completed={stats.completed}
            lastMutation={lastMutation}
            lastSyncedAt={lastSyncedAt}
          />
        </RenderProfiler>
      </Suspense>
    </div>
  );
}
