import { useCallback, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskFilters from "./components/TaskFilters";
import TaskList from "./components/TaskList";
import Button from "../../shared/components/Button";
import LoadingPanel from "../../shared/components/LoadingPanel";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setFilter } from "./tasksSlice";
import {
  selectCanClearCompleted,
  selectHasLoadedTasks,
  selectIsTasksBusy,
  selectLastMutation,
  selectLastSyncedAt,
  selectTaskError,
  selectTaskFilter,
  selectTaskStats,
  selectVisibleTaskIds,
} from "./tasksSelectors";
import {
  addTask,
  clearCompleted,
  deleteTask,
  fetchTasks,
  toggleTask,
} from "./tasksThunks";

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectTaskFilter);
  const visibleTaskIds = useAppSelector(selectVisibleTaskIds);
  const stats = useAppSelector(selectTaskStats);
  const isBusy = useAppSelector(selectIsTasksBusy);
  const canClearCompleted = useAppSelector(selectCanClearCompleted);
  const error = useAppSelector(selectTaskError);
  const hasLoaded = useAppSelector(selectHasLoadedTasks);
  const lastSyncedAt = useAppSelector(selectLastSyncedAt);
  const lastMutation = useAppSelector(selectLastMutation);

  useEffect(() => {
    if (!hasLoaded) {
      dispatch(fetchTasks());
    }
  }, [dispatch, hasLoaded]);

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

  const showInitialLoading = isBusy && !hasLoaded;

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
            Day 7 architecture: shared app shell, route-level boundaries, and
            reusable loading states
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

        <div className="mt-6">
          {showInitialLoading ? (
            <LoadingPanel
              compact
              title="Loading tasks..."
              description="Restoring the task workspace and synchronizing the first view."
            />
          ) : (
            <TaskList
              taskIds={visibleTaskIds}
              onToggle={onToggle}
              onDelete={onDelete}
              disabled={isBusy}
            />
          )}
        </div>
      </main>

      <footer className="mt-6 px-1 text-sm text-slate-500">
        Day 7 focus: stronger route boundaries, reusable screen-level loading,
        and a more production-shaped app shell.
        {lastMutation && (
          <span className="mt-2 block">
            Last mutation: <b>{lastMutation}</b>
          </span>
        )}
        {lastSyncedAt && (
          <span className="mt-1 block">
            Last sync: <b>{new Date(lastSyncedAt).toLocaleTimeString()}</b>
          </span>
        )}
      </footer>
    </div>
  );
}
