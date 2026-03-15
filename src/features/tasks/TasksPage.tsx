import { lazy, Suspense, useCallback, useDeferredValue, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskFilters from "./components/TaskFilters";
import TaskList from "./components/TaskList";
import Button from "../../shared/components/Button";
import LoadingPanel from "../../shared/components/LoadingPanel";
import RenderProfiler from "../../shared/components/RenderProfiler";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useGetTasksQuery } from "./tasksApi";
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
import {
  addTask,
  clearCompleted,
  deleteTask,
  toggleTask,
} from "./tasksThunks";

const TasksInsightsPanel = lazy(() => import("./components/TasksInsightsPanel"));

function getQueryErrorMessage(error: unknown) {
  return typeof error === "string" ? error : null;
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
    isFetching,
    isLoading,
  } = useGetTasksQuery();

  useEffect(() => {
    if (fetchedTasks) {
      dispatch(hydrateTasksFromQuery({ tasks: fetchedTasks }));
    }
  }, [dispatch, fetchedTasks]);

  const onAdd = useCallback(
    (title: string) => {
      dispatch(addTask({ title }));
    },
    [dispatch],
  );

  const onToggle = useCallback(
    (id: string) => {
      dispatch(toggleTask({ id }));
    },
    [dispatch],
  );

  const onDelete = useCallback(
    (id: string) => {
      dispatch(deleteTask({ id }));
    },
    [dispatch],
  );

  const onClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  const onFilterChange = useCallback(
    (nextFilter: typeof filter) => {
      dispatch(setFilter({ filter: nextFilter }));
    },
    [dispatch],
  );

  const showInitialLoading = (isLoading || isFetching) && !hasLoaded;
  const isListDeferred = deferredTaskIds !== visibleTaskIds;
  const isBusy = isMutating || showInitialLoading;
  const error = taskErrors.mutate ?? getQueryErrorMessage(fetchError);

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
            Day 7 architecture: shared shell, lazy insights, deferred list rendering,
            and profiling-friendly boundaries
          </p>
        </div>

        <div className="sm:pt-4">
          <Button
            variant="secondary"
            onClick={onClearCompleted}
            disabled={!canClearCompleted || isBusy}
          >
            Clear completed
          </Button>
        </div>
      </header>

      <main className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <TaskForm onAdd={onAdd} disabled={isBusy} />

        <div className="mt-6">
          <TaskFilters
            value={filter}
            onChange={onFilterChange}
            disabled={isBusy}
          />
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
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
          ) : (
            <RenderProfiler id="TasksList">
              <TaskList
                taskIds={deferredTaskIds}
                onToggle={onToggle}
                onDelete={onDelete}
                disabled={isBusy}
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
